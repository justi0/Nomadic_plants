# Nomadic_plants
Nomadic Plants is a Web3 protocol connecting nomadic people to local environments through shared plant stewardship. Each physical plant is paired with an NFT that records care, location, and handovers as people move while plants stay rooted. Built for the localism track, it enables place-based continuity, responsibility, and care beyond ownership.

# 🌿 Nomadic Plants

Redefining plant ownership through community stewardship

> 🏆 Built for the ETH ChiangMai hackathon
2026


## 📖 The Vision

In a world where we move more than ever, owning plants can be a burden. **Nomadic Plants** flips the script: **Don't own, steward.**

This application allows plants to have their own digital identity (NFT) that travels with them. Users become temporary "stewards," earning on-chain reputation for their care, and easily "handing over" the plant NFT to the next person when they move.

## 🚀 Key Features

### 1. 🆔 **Plant Identity (NFT Passport)**
Every plant is minted as a unique NFT on the **Base** blockchain. This NFT holds the plant's history, care requirements, and lineage of stewards.

### 2. 🤝 **Seamless Handover**
Moving to a new city? Don't throw your plant away. The **Handover Flow** allows you to transfer the Plant NFT to a new steward's wallet with just a few taps.
- **Gas-optimized on Base**: Fast and cheap transfers.
- **Trustless**: Verification of ownership transfer on-chain.

### 3. 💧 **Proof of Care**
Stewards log water, sunlight, and repotting events. These actions can be verified, building a "Green Score" for the user's wallet. 
*(Note: Care logs are currently off-chain/mocked for the demo, with on-chain attestation planned).*

### 4. 🛍️ **Adoption Marketplace**
Browse plants in your local area (mocked GPS) that need a new home. Mint a fresh NFT to start a new plant journey or adopt an existing one.

## 🛠️ Tech Stack

- **Mobile Framework**: React Native (Expo)
- **Blockchain**: Base (Ethereum L2)
- **Web3 Integration**: Ethers.js
- **Storage**: IPFS (Planned for metadata), AsyncStorage (Local Demo)
- **Design**: Custom "Green-Tech" UI system

## 🏄 Flow for Judges (Demo)

1. **Connect Wallet**: Create a fresh "burner" wallet or connect an existing one. We fund new users with **0.50 ETH** (Mock) to get started. 🤑
2. **Adopt**: Go to **"Find a Plant"** and adopt "Sage" or "Guest". Watch the minting transaction happen.
3. **Steward**: View your plant in **"My Plants"**. Check its care/water schedule.
4. **Handover**: Open the plant details and click **"Start Handover Transfer"**. Enter a friend's address (or any mock address) to pass the torch.
5. **Verify**: See the ownership update instantly.

## 📦 local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/justi0/Nomadic_plants.git
   cd Nomadic_plants
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the App**
   ```bash
   npx expo start
   ```
   *Press `w` to run in Web Browser, or scan the QR code with Expo Go.*

## 🔮 Future Roadmap

- **Smart Contract Deployment**: Deploying the ERC-721 contract to Base Mainnet.
- **Social Graph**: "Friend" other stewards and see their plant collections.
- **IoT Integration**: Sensors that auto-mint "Watered" attestations to the NFT.

---

*Made with 💚 by the Nomadic Plants Team*


## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Deploy.s.sol --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
