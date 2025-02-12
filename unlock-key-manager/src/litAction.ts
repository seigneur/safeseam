// @ts-nocheck

const _litActionCode = async () => {
  try {
    const apiKey = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: "ethereum",
    });

    Lit.Actions.setResponse({ response: apiKey });
  } catch (e) {
    Lit.Actions.setResponse({ response: e.message });
  }
};

export const litActionCode = `(${_litActionCode.toString()})();`;