import hre from "hardhat";
const { ethers, getNamedAccounts } = hre;

async function main() {
  const { deployer } = await getNamedAccounts();
  const contract = await ethers.getContract("FundMe", deployer);

  console.log(
    `Withdrawing ${ethers.formatEther(await ethers.provider.getBalance(contract.target))} ETH ...`,
  );
  const withdrawTrx = await contract.withdraw();
  await withdrawTrx.wait(1);
  console.log("Withdrawn!");
}

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
