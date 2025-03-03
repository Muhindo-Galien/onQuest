import { utils } from "zksync-ethers";

const deployer = new Deployer(hre, wallet);
const artifact = await deployer.loadArtifact("Airdrop");

await hre.zkUpgrades.deployProxy(
  deployer.zkWallet,
  artifact,
  [initializerArgs],
  {
    initializer: "initialize",
    paymasterProxyParams: params,
    paymasterImplParams: params,
  }
);
