
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  console.log("Deploying CampusChainAttendance...");

  const contract = await ethers.deployContract("CampusChainAttendance");

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("CampusChainAttendance deployed successfully!");
  console.log("Contract Address:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
