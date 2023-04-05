import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { TimelockController } from "../../types/contracts/OZGovernor/TIMELOCK_CONTROLLER.sol/TimelockController";
import { ERC20_TOKEN } from "../../types/contracts/OZGovernor/ERC20/ERC20_TOKEN";

export interface ERC20GovernorFixture {
  token: ERC20_TOKEN;
  timelock: TimelockController;
  governorFactory: ContractFactory;
  cancelRoleAddresses: string[];
  defaultAdmin: string;
  votingDelay: number;
  votingPeriod: number;
  proposalThreshold: number;
  quorumFraction: number;
}

export async function erc20GovernorFixture(): Promise<ERC20GovernorFixture> {
  const [deployer, defaultAdmin, ...cancelRoleAddresses] = await ethers.getSigners();

  const tokenFactory = await ethers.getContractFactory("ERC20_TOKEN");
  const token = (await tokenFactory.deploy(deployer.address)) as ERC20_TOKEN;

  const timelockFactory = await ethers.getContractFactory("contracts/OZGovernor/TIMELOCK_CONTROLLER.sol:TimelockController");
  const timelock = (await timelockFactory.deploy(1, [deployer.address], [deployer.address])) as TimelockController;

  const governorFactory = await ethers.getContractFactory("contracts/OZGovernor/ERC20/ERC20_GOVERNOR.sol:MyGovernor");

  const votingDelay = 1;
  const votingPeriod = 50400;
  const proposalThreshold = 0;
  const quorumFraction = 4;

  return {
    token,
    timelock,
    governorFactory,
    cancelRoleAddresses: cancelRoleAddresses.map(addr => addr.address),
    defaultAdmin: defaultAdmin.address,
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorumFraction,
  };
}
