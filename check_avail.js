import { ethers } from "ethers";

// EDIT HERE//////////////////////
const WALLET_PRIVATE_KEYS = [];

async function checkRewards(address, signedMessage, timestamp) {
  const requestBody = {
    account: address,
    signedMessage: signedMessage,
    timestamp: timestamp,
    type: "ETHEREUM",
  };

  try {
    const response = await fetch(
      "https://claim-api.availproject.org/check-rewards",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    console.log(`Account ${address} - Rewards:`, data);
  } catch (error) {
    console.error(`Error checking rewards for account ${address}:`, error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function start() {
  for (const priv of WALLET_PRIVATE_KEYS) {
    const wallet = new ethers.Wallet(priv);
    const address = await wallet.getAddress();
    const timestamp = String(Math.floor(Date.now() / 1000));
    const message = `Greetings from Avail!\n\nSign this message to check your eligibility. This signature will not cost you any fees.\n\nTimestamp: ${timestamp}`;
    const signature = await wallet.signMessage(message);
    await checkRewards(address, signature, timestamp);
    await sleep(1000);
  }
}

start();
