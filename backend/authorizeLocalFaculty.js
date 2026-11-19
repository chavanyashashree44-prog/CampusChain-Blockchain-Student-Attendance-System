
require('dotenv').config()

const { ethers } = require('ethers')
const contractArtifact = require('./app/contracts/CampusChainAttendance.json')

async function main() {
  const provider = new ethers.JsonRpcProvider(
    process.env.BLOCKCHAIN_RPC_URL
  )

  const wallet = new ethers.Wallet(
    process.env.BLOCKCHAIN_PRIVATE_KEY,
    provider
  )

  const contract = new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    contractArtifact.abi,
    wallet
  )

  console.log('Authorizing local faculty wallet...')

  const transaction = await contract.authorizeFaculty(
    wallet.address,
    true
  )

  const receipt = await transaction.wait()

  console.log('Faculty wallet authorized successfully!')
  console.log('Wallet:', wallet.address)
  console.log('Transaction:', receipt.hash)
}

main().catch((error) => {
  console.error('Authorization failed:', error.message)
  process.exitCode = 1
})
