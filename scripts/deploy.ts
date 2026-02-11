import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy MockUSDC
  console.log("\nDeploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCAddress);

  // Deploy MarketFactory
  console.log("\nDeploying MarketFactory...");
  const MarketFactory = await ethers.getContractFactory("MarketFactory");
  const marketFactory = await MarketFactory.deploy(mockUSDCAddress);
  await marketFactory.waitForDeployment();
  const marketFactoryAddress = await marketFactory.getAddress();
  console.log("MarketFactory deployed to:", marketFactoryAddress);

  // Create example market: "Will APT drop >30% in 14 days?"
  console.log("\nCreating example market...");
  const question = "Will APT drop >30% in 14 days?";
  const duration = 14 * 24 * 60 * 60; // 14 days in seconds
  
  const tx = await marketFactory.createMarket(question, duration);
  const receipt = await tx.wait();
  
  // Get market address from event
  const event = receipt?.logs.find(
    (log: any) => log.topics[0] === ethers.id("MarketCreated(address,string,uint256)")
  );
  
  if (event) {
    const decoded = marketFactory.interface.parseLog(event);
    const marketAddress = decoded?.args[0];
    console.log("Market created at:", marketAddress);
    console.log("Question:", question);
  }

  // Mint some MockUSDC to deployer for testing
  console.log("\nMinting MockUSDC to deployer...");
  const mintAmount = ethers.parseUnits("10000", 6); // 10,000 USDC (6 decimals)
  await mockUSDC.mint(deployer.address, mintAmount);
  console.log("Minted", ethers.formatUnits(mintAmount, 6), "MockUSDC to", deployer.address);

  console.log("\n=== Deployment Summary ===");
  console.log("MockUSDC:", mockUSDCAddress);
  console.log("MarketFactory:", marketFactoryAddress);
  console.log("\nAdd these to your .env file:");
  console.log(`NEXT_PUBLIC_MOCK_USDC_ADDRESS=${mockUSDCAddress}`);
  console.log(`NEXT_PUBLIC_MARKET_FACTORY_ADDRESS=${marketFactoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
