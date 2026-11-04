"use strict";

import * as ethers from "./ethers.min.js";
import FundMeDeployment from "./contract/deployments/localhost/FundMe.json" with { type: "json" };

let provider, walletAddress;

const currentBalance = document.querySelector("#balance span");
const fundAmount = document.getElementById("ethAmount");

const connectBtn = document.getElementById("connectButton");
const fundBtn = document.getElementById("fundButton");
const getBalanceBtn = document.getElementById("balanceButton");
const withdrawBtn = document.getElementById("withdrawButton");

async function fund() {
  try {
    // provider
    if (!provider) await setMetaMask();
    const _provider = new ethers.BrowserProvider(provider);
    // singer
    const _singer = await _provider.getSigner();
    // contract (address & abi)
    const contract = new ethers.Contract(
      FundMeDeployment.address,
      FundMeDeployment.abi,
      _singer,
    );

    console.log(`Funding ${fundAmount.value}...`);
    const txResponse = await contract.fund({
      value: ethers.parseEther(fundAmount.value.toString()),
    });
  } catch (error) {
    console.error(error);
  }
}

async function getBalance() {
  try {
    // provider
    if (!provider) await setMetaMask();
    const _provider = new ethers.BrowserProvider(provider);
    // singer
    const _singer = await _provider.getSigner();
    // contract (address & abi)
    const contract = new ethers.Contract(
      FundMeDeployment.address,
      FundMeDeployment.abi,
      _singer,
    );
    const contractBalance = await _provider.getBalance(
      FundMeDeployment.address,
    );

    currentBalance.textContent = ethers.formatEther(contractBalance);
  } catch (error) {
    console.error(error);
  }
}
function setMetaMask() {
  return new Promise((resolve, reject) => {
    function handleAccounce(event) {
      const { info, provider: walletProvider } = event.detail;

      if (info.rdns !== "io.metamask" || !walletProvider) return;
      console.log("MetaMask detected");
      provider = walletProvider;

      window.removeEventListener("eip6963:announceProvider", handleAccounce);
      clearTimeout(timeoutID);

      resolve(provider);
    }

    window.addEventListener("eip6963:announceProvider", handleAccounce);

    const timeoutID = setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", handleAccounce);
      reject(new Error("MetaMask not found"));
    }, 3000);

    window.dispatchEvent(new Event("eip6963:requestProvider"));
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

fundBtn.addEventListener("click", fund);
getBalanceBtn.addEventListener("click", getBalance);
