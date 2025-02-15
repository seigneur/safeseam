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

    const seamResponse = await fetch('https://connect.getseam.com/locks/unlock_door', {
      'method': 'POST',
      'headers': {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SEAM_API_KEY}`
      },
      'body': JSON.stringify({
        'device_id': deviceId
      })
    })

    console.log(seamResponse)

    Lit.Actions.setResponse({ response: seamResponse.ok });
  } catch (e) {
    Lit.Actions.setResponse({ response: e.message });
  }
};

export const litActionCode = `(${_litActionCode.toString()})();`;