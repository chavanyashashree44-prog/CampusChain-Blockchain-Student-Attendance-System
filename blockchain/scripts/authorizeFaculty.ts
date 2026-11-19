
import { network } from "hardhat";
import dotenv from "dotenv";

import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), "../backend/.env"),
});

async function main() {
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("Contract address is missing.");
  }

  const { ethers } = await network.connect();
  const [owner] = await ethers.getSigners();

  const contract = await ethers.getContractAt(
    "CampusChainAttendance",
    contractAddress
  );

  const tx = await contract.authorizeFaculty(
    owner.address,
    true
  );

  await tx.wait();

  console.log("Faculty wallet authorized successfully!");
  console.log("Authorized wallet:", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
