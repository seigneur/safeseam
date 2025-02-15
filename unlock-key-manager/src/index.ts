import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { encryptString } from '@lit-protocol/encryption';
import { LIT_NETWORK, LIT_RPC, LIT_ABILITY } from "@lit-protocol/constants";
import {
  createSiweMessage,
  LitAccessControlConditionResource,
  LitActionResource,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import AccessControlConditions from "@lit-protocol/types";
import * as ethers from "ethers";

import { litActionCode } from "./litAction.ts";
import { getEnv } from "./utils.ts";

const ETHEREUM_PRIVATE_KEY = getEnv("ETHEREUM_PRIVATE_KEY");
const LIT_CAPACITY_CREDIT_TOKEN_ID =
  process.env["LIT_CAPACITY_CREDIT_TOKEN_ID"];
const SEAM_API_KEY = getEnv("SEAM_API_KEY");

export const decryptApiKey = async (key: string, amount: string, checkAddress: string, deviceId: string) => {
  let litNodeClient: LitNodeClient;

  try {
    //#region Setup
    const ethersWallet = new ethers.Wallet(
      ETHEREUM_PRIVATE_KEY,
      new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
    );

    console.log("🔄 Connecting to the Lit network...");
    litNodeClient = new LitNodeClient({
      litNetwork: LIT_NETWORK.DatilTest,
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to the Lit network");

    console.log("🔄 Connecting LitContracts client to network...");
    const litContracts = new LitContracts({
      signer: ethersWallet,
      network: LIT_NETWORK.DatilTest,
      debug: false,
    });
    await litContracts.connect();
    console.log("✅ Connected LitContracts client to network");

    let capacityTokenId = LIT_CAPACITY_CREDIT_TOKEN_ID;
    if (capacityTokenId === "" || capacityTokenId === undefined) {
      console.log("🔄 No Capacity Credit provided, minting a new one...");
      capacityTokenId = (
        await litContracts.mintCapacityCreditsNFT({
          requestsPerKilosecond: 10,
          daysUntilUTCMidnightExpiration: 1,
        })
      ).capacityTokenIdStr;
      console.log(`✅ Minted new Capacity Credit with ID: ${capacityTokenId}`);
    } else {
      console.log(
        `ℹ️  Using provided Capacity Credit with ID: ${LIT_CAPACITY_CREDIT_TOKEN_ID}`
      );
    }

    console.log("🔄 Creating capacityDelegationAuthSig...");
    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: ethersWallet,
        capacityTokenId,
        delegateeAddresses: [ethersWallet.address],
        uses: "1",
      });
    console.log("✅ Capacity Delegation Auth Sig created");
    //#endregion

    const accessControlConditions: AccessControlConditions = [
      {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [checkAddress, "latest"], // Replace with your desired Ethereum address
      returnValueTest: {
      comparator: ">=",
      value: amount,
      },
      },
    ];

    console.log("🔐 Encrypting the API key...");
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        dataToEncrypt: key,
      },
      litNodeClient
    );
    console.log("✅ Encrypted the API key");
    console.log("ℹ️  The base64-encoded ciphertext:", ciphertext);
    console.log(
      "ℹ️  The hash of the data that was encrypted:",
      dataToEncryptHash
    );

    console.log("🔄 Generating the Resource String...");
    const accsResourceString =
      await LitAccessControlConditionResource.generateResourceString(
        accessControlConditions as any,
        dataToEncryptHash
      );
    console.log("✅ Generated the Resource String");

    console.log("🔄 Getting the Session Signatures...");
    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      capabilityAuthSigs: [capacityDelegationAuthSig],
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource(accsResourceString),
          ability: LIT_ABILITY.AccessControlConditionDecryption,
        },
        {
          resource: new LitActionResource("*"),
          ability: LIT_ABILITY.LitActionExecution,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: ethersWallet.address,
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersWallet,
          toSign,
        });
      },
    });
    console.log("✅ Generated the Session Signatures");

    console.log("🔄 Executing the Lit Action...");
    const litActionSignatures = await litNodeClient.executeJs({
      sessionSigs,
      code: litActionCode,
      jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        SEAM_API_KEY,
        deviceId,
      },
    });
    console.log("✅ Executed the Lit Action");

    return litActionSignatures;
  } catch (error) {
    console.error(error);
  } finally {
    litNodeClient!.disconnect();
  }
};

const main = async () => {
  const key = "UNLOCK_GARAGE_AUGUST";
  
  const result = await decryptApiKey(key, '10', '0x810181e929658A86983c4bDdA3dc251b7dA6FA00', 'd70c426e-b6f9-4635-a07a-93f93ffb5080');
  console.log("Decryption result:", result);
};

main().catch(console.error);