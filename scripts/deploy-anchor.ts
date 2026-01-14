// Script to deploy Anchor contract to Polygon
// Usage: npx tsx scripts/deploy-anchor.ts

import { ethers } from 'ethers'

async function deploy() {
  const network = process.env.POLYGON_NETWORK || 'polygon-mainnet'
  const privateKey = process.env.ANCHOR_PRIVATE_KEY

  if (!privateKey) {
    throw new Error('ANCHOR_PRIVATE_KEY environment variable is required')
  }

  const rpcUrl = process.env.POLYGON_RPC_URL || (
    network === 'polygon-mainnet'
      ? 'https://polygon-rpc.com'
      : 'https://rpc-mumbai.maticvigil.com'
  )

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new ethers.Wallet(privateKey, provider)

  console.log(`Deploying to ${network}...`)
  console.log(`Wallet address: ${wallet.address}`)

  // Check balance
  const balance = await provider.getBalance(wallet.address)
  console.log(`Balance: ${ethers.formatEther(balance)} MATIC`)

  if (balance < ethers.parseEther('0.01')) {
    throw new Error('Insufficient MATIC for deployment')
  }

  // Contract bytecode and ABI (simplified - in production use Hardhat/Truffle)
  const contractSource = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;
    
    contract Anchor {
        event Anchored(bytes32 indexed root, uint256 indexed timestamp, string batchId);
        
        function anchor(bytes32 root, string calldata batchId) external {
            emit Anchored(root, block.timestamp, batchId);
        }
    }
  `

  console.log('\nTo deploy:')
  console.log('1. Compile contract using Hardhat or Remix')
  console.log('2. Deploy using ethers.js:')
  console.log(`
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    const contract = await factory.deploy()
    await contract.waitForDeployment()
    console.log('Contract deployed at:', await contract.getAddress())
  `)
  console.log('\n3. Set ANCHOR_CONTRACT_ADDRESS environment variable')
}

deploy().catch(console.error)
