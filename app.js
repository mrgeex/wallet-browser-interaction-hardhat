"use strict";

import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.15.0/+esm";

let provider, walletAddress;

const currentBalance = document.querySelector("#balance span");
const fundAmount = document.getElementById("ethAmount");

const connectBtn = document.getElementById("connectButton");
const fundBtn = document.getElementById("fundButton");
const getBalanceBtn = document.getElementById("balanceButton");
const withdrawBtn = document.getElementById("withdrawButton");

function setMetaMask() {
  return new Promise((resolve, reject) => {
    function handleAccounce(event) {
      const { info, provider: walletProvider } = event.detail;

      if (info.rdns === "io.metamask") {
        console.log("MetaMask detected");
        provider = walletProvider;

        window.removeEventListener("eip6963:announceProvider", handleAccounce);
        clearTimeout(timeoutID);

        resolve(provider);
      }
    }

    window.addEventListener("eip6963:announceProvider", handleAccounce);

    window.dispatchEvent(new Event("eip6963:requestProvider"));

    const timeoutID = setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", handleAccounce);
      reject(new Error("MetaMask not found"));
    }, 3000);
  });
}

window.addEventListener("load", async () => {
  try {
    await setMetaMask();

    const accounts = await provider.request({
      method: "eth_accounts",
    });
    if (accounts.length > 0) {
      walletAddress = accounts[0];
      connectBtn.textContent = `Connected to ${walletAddress.slice(0, 6)}***${walletAddress.slice(-4)}`;
    }
  } catch (error) {
    alert(error);
  }
});

connectBtn.addEventListener("click", async () => {
  console.log("connecting...");
  try {
    await setMetaMask();

    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      walletAddress = accounts[0];
      connectBtn.textContent = `Connected to ${walletAddress.slice(0, 6)}***${walletAddress.slice(-4)}`;
    }
  } catch (error) {
    alert(error);
  }
});
