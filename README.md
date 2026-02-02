# Nomadic_plants
Nomadic Plants is a Web3 protocol connecting nomadic people to local environments through shared plant stewardship. Each physical plant is paired with an NFT that records care, location, and handovers as people move while plants stay rooted. Built for the localism track, it enables place-based continuity, responsibility, and care beyond ownership.

# 🌿 Nomadic Plants

Redefining plant ownership through community stewardship

> 🏆 Built for the ETH ChiangMai hackathon
2026

# [Demo](https://nomadic-plants.vercel.app/)

## Contracts

[PlantRegistry](https://sepolia.etherscan.io/address/0x711a471eda605c9cfb2e1534e52d0930c647de5b)
[StewardBadge](https://sepolia.etherscan.io/address/0xdd9894f665e1400cfad2c8455ec1384579848a96)

## 📖 The Vision

In a world where we move more than ever, owning plants can be a burden. **Nomadic Plants** flips the script: **Don't own, steward.**

This application allows plants to have their own digital identity (NFT) that travels with them. Users become temporary "stewards," earning on-chain reputation for their care, and easily "handing over" the plant NFT to the next person when they move.

## 🚀 Key Features

### 1. 🆔 **Plant Identity (NFT Passport)**
Every plant is minted as a unique NFT on the **Ethereum Sepolia** blockchain. This NFT holds the plant's history, care requirements, and lineage of stewards.

### 2. 🤝 **Seamless Handover**
Moving to a new city? Don't throw your plant away. The **Handover Flow** allows you to transfer the Plant NFT to a new steward's wallet with just a few taps.
- **Gas-optimized**: Fast and cheap transfers.
- **Trustless**: Verification of ownership transfer on-chain.

### 3. 💧 **Proof of Care**
Stewards log water, sunlight, and repotting events. These actions can be verified, building a "Green Score" for the user's wallet. 

### 4. 🛍️ **Adoption Marketplace**
Browse plants in your local area (mocked GPS) that need a new home. Mint a fresh NFT to start a new plant journey or adopt an existing one.

## 🛠️ Tech Stack

- **Web Framework**: NextJs
- **Blockchain**: Ethereum Sepolia
- **Web3 Integration**: Viem
- **Storage**: IPFS (Planned for metadata)
- **Design**: Custom "Green-Tech" UI system

## 🏄 Flow for Judges (Demo)

1. **Connect Wallet**: Create a fresh "burner" wallet or connect an existing one. We have gas sponsored for you to try out.
2. **Adopt**: Go to **"Find a Plant"** and adopt "Sage" or "Guest". Watch the minting transaction happen.
3. **Steward**: View your plant in **"My Plants"**. Check its care/water schedule.
4. **Handover**: Open the plant details and click **"Start Handover Transfer"**. Enter a friend's address to pass the torch.
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
   npm run dev
   ```
   *Press `w` to run in Web Browser, or scan the QR code with Expo Go.*

## 🔮 Future Roadmap

- **Smart Contract Deployment**: Deploying the contracts to Mainnet.
- **Social Graph**: "Friend" other stewards and see their plant collections.
- **IoT Integration**: Sensors that auto-mint "Watered" attestations to the NFT.

---

*Made with 💚 by the Nomadic Plants Team*



