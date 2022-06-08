# Smart Contract - Employee Token Compensation

## About

This mini-project includes 4 smart contracts:

1. BluToken.sol
2. EBlu Token.sol
3. Wallet.sol
4. BluMinter.sol

EBluToken.sol is an ERC20 token. The deploy script will transfer the ownership of this token to company's wallet contract. Only the wallet will be able to mint and burn this token.

BluToken.sol is an ERC20 token. The deploy script will transfer the ownership of this token to BluMinter contract. 

Wallet.sol represents the wallet of the company. This wallet is responsible for the following functionalities:

1. Send EBLU to employees of the company 

2. Allows employees to exchange BLU tokens for EBLU tokens.

Each employee will be allowed to redeem Blu tokens based on the total supply of minted BLU tokens. The equivalent amount of eBlu tokens that are exchanged for BLU tokens are burned. The deployer of the contract will also be owner of the Wallet.



BluMinter.sol mocks two main functionalities of the DAO:

 1. Mints the initial supply of 1 million BLU tokens. 
2. For every BLU token minted up to a total supply of 100 million, 10% of those tokens are minted to company's wallet. 

The deploy script will trigger minting of the initial supply. The deployer of this contract will also be the owner of this contract. 

## Installation

Run these commands to clone the repository and install dependencies.

```python
git clone git@github.com:sheilashehu/solidity_challenge.git
cd solidity_challenge
yarn install
```
## Usage

### Testing 
```python
npx hardhat test
```

### Deployment
```python
yarn hardhat deploy --network rinkeby
```

### Remix

1. Go to Remix

2. Paste the code from BluToken.sol, EBlu Token.sol, Wallet.sol, and BluMinter.sol into a new file in Remix.

3. Compile the contracts.

4. Deploy BluToken.sol and EbluToken.sol. To deploy Wallet.sol you need to insert the smart contracts addresses of BlueToken and EbluToken. To deploy BluMinter.sol, you need the Wallet address and Blu Address.

### Technology Stack and Tools

Hardhat - development framework

Solidity - ethereum smart contract language

ethers.js - library interact with ethereum nodes

Alchemy - connection to ethereum network

Open Zeppelin - smart contract libraries

### 

## License
[MIT](https://choosealicense.com/licenses/mit/)