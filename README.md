# OnQuest

OnQuest is a trustless on-chain reward system that verifies quest completion using zkTLS, ensuring authentic API data before allowing claims on Sophon.

> **Note:** This project is currently under active development. Features and documentation may change as we continue to improve the platform.

## Overview

OnQuest is a trustless on-chain reward system that verifies quest completion using zkTLS, ensuring authentic API data before allowing users to claim rewards on Sophon. By leveraging zkTLS, the system eliminates the need for centralized oracles and ensures tamper-proof, cryptographically verified proof of participation in off-chain activities, such as Twitter follows, retweets, Discord joins, and other Web2 engagements.

## How It Works

### 1. Connect Wallet

- Users start by connecting their Web3 wallet (MetaMask, WalletConnect, etc.) to the OnQuest platform.
- This establishes their on-chain identity for receiving rewards.
  ![OnQuest Workflow](https://i.ibb.co/DPRsS8sR/Screenshot-2025-03-02-at-22-46-33.png)

### 2. User Requests Verification

- After connecting their wallet, users initiate a quest verification request by providing their Twitter handle, Discord ID, or other identifiers.
  ![OnQuest Workflow](https://i.ibb.co/Knzpysp/Screenshot-2025-03-02-at-22-49-42.png)

### 3. Fetching API Data via zkTLS

- The system queries the respective API (e.g., Twitter for follows, Discord for membership) and generates a zkTLS-proof to confirm the user's completion of the quest.
- zkTLS ensures:
  - The API response is genuine and directly sourced from the service provider.
  - The data is unaltered and cryptographically verified before being processed.
  - The request was sent by the user, preventing fraud or sybil attacks.
    ![OnQuest Workflow](https://i.ibb.co/fz7zxRcd/Screenshot-2025-03-03-at-00-05-37.png)

### 4. Generating a Zero-Knowledge Proof (ZKP)

- The zkTLS system generates a proof of quest completion that can be verified on-chain.
- No sensitive user data (API keys, private details) is leaked.

### 5. Smart Contract Verification on Sophon

- The user submits the zkTLS proof to the Sophon smart contract.
- The contract verifies the proof and distributes rewards if the quest is successfully completed.

![OnQuest Workflow](https://i.ibb.co/nqXkfF6x/Screenshot-2025-03-02-at-22-49-22.png)

## Use Cases

- **Web3 Growth Campaigns and Airdrops** – Projects can use zkTLS verification for Twitter follows, retweets, Discord joins, and other off-chain activities, preventing bot manipulation.
- **DAO Governance Participation** – DAOs can verify community engagement (e.g., attending AMAs, voting participation) before rewarding contributors.
- **GameFi and NFT Campaigns** – zkTLS-verified user actions can unlock NFT rewards, in-game items, or token incentives.
- **DeFi Loyalty Programs** – Users can prove engagement with DeFi protocols (e.g., using a DEX, staking tokens) before claiming rewards.

## Why zkTLS?

- **Eliminates Centralized Trust** – No need for centralized oracles to verify off-chain quests.
- **Prevents Fake Claims** – Ensures users actually completed quests before earning rewards.
- **Enhances Privacy** – Users don't expose sensitive credentials while proving quest completion.
- **Fully On-Chain Verification** – Smart contracts process rewards only if zkTLS proofs are valid.

## Conclusion

OnQuest brings trustless quest validation to Web3, making reward systems more secure, verifiable, and resistant to manipulation. It ensures Web3 projects, DAOs, and DeFi platforms can distribute rewards fairly based on authentic user actions without relying on centralized verification services.
