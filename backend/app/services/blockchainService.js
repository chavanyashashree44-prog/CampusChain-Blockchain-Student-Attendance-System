
const { ethers } = require('ethers')
const contractArtifact = require('../contracts/CampusChainAttendance.json')

const getBlockchainContract = () => {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY

  if (!rpcUrl || !contractAddress || !privateKey) {
    throw new Error('Blockchain environment variables are missing.')
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)

  return new ethers.Contract(
    contractAddress,
    contractArtifact.abi,
    wallet
  )
}

// Record approved attendance on blockchain
const recordAttendanceOnBlockchain = async (studentId, sessionId) => {
  const contract = getBlockchainContract()

  const studentIdHash = ethers.keccak256(
    ethers.toUtf8Bytes(String(studentId))
  )

  const sessionIdHash = ethers.keccak256(
    ethers.toUtf8Bytes(String(sessionId))
  )

  const transaction = await contract.recordAttendance(
    studentIdHash,
    sessionIdHash
  )

  const receipt = await transaction.wait()

  return {
    transactionHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  }
}

// Verify attendance directly from blockchain
const verifyAttendanceOnBlockchain = async (studentId, sessionId) => {
  const contract = getBlockchainContract()

  const studentIdHash = ethers.keccak256(
    ethers.toUtf8Bytes(String(studentId))
  )

  const sessionIdHash = ethers.keccak256(
    ethers.toUtf8Bytes(String(sessionId))
  )

  const result = await contract.verifyAttendance(
    studentIdHash,
    sessionIdHash
  )

  return {
    recorded: result[0],
    timestamp: Number(result[1]),
    approvedBy: result[2],
  }
}

module.exports = {
  recordAttendanceOnBlockchain,
  verifyAttendanceOnBlockchain,
}
