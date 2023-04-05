import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";

import { ERC20_Governor } from "../../types/contracts/OZGovernor/ERC20/ERC20_GOVERNOR.sol"

const { parseEther } = ethers.utils;
const { advanceBlock, advanceBlockTo, latest } = waffle.provider;

describe("ERC20_Governor_voting", function () {
  let timelock, governor, token, proposer, voter1, voter2, executor;

  beforeEach(async function () {
    const [deployer, _proposer, _voter1, _voter2, _executor] = await ethers.getSigners();
    proposer = _proposer;
    voter1 = _voter1;
    voter2 = _voter2;
    executor = _executor;

    const Timelock = await ethers.getContractFactory("Timelock");
    const Governor = await ethers.getContractFactory("Governor");
    const Token = await ethers.getContractFactory("Token");

    // Deploy Timelock, Governor, and Token contracts
    timelock = await Timelock.deploy(executor.address, 2 * 24 * 60 * 60); // 2 days delay
    await timelock.deployed();

    token = await Token.deploy("MyToken", "MTK");
    await token.deployed();

    governor = <ERC20_Governor>await Governor.deploy(timelock.address, token.address);
    await governor.deployed();

    // Assign roles
    await timelock.connect(executor).setPendingAdmin(governor.address);
    await governor.__acceptAdmin();

    // Grant some tokens to the proposer, voter1, and voter2
    const amount = parseEther("1000");
    await token.mint(proposer.address, amount);
    await token.mint(voter1.address, amount);
    await token.mint(voter2.address, amount);

    // Approve the Governor to spend tokens on behalf of proposer, voter1, and voter2
    await token.connect(proposer).approve(governor.address, amount);
    await token.connect(voter1).approve(governor.address, amount);
    await token.connect(voter2).approve(governor.address, amount);
  });


  describe("ERC20 Governor Voting", function () {
    it("Should create, vote, and execute a proposal successfully", async function () {
      // Proposer creates a proposal
      const targets = [token.address];
      const values = ["0"];
      const calldatas = [
        token.interface.encodeFunctionData("mint", [executor.address, parseEther("100")]),
      ];
      const description = "Mint 100 tokens to executor";

      await governor.connect(proposer).propose(targets, values, calldatas, description);
      const proposalId = await governor.latestProposalIds(proposer.address);
      expect(await governor.getActions(proposalId)).to.deep.equal([targets, values, calldatas]);

      // Advance the block time to pass the voting delay
      await ethers.provider.send("evm_increaseTime", [1]);
      await ethers.provider.send("evm_mine");

      // Voters vote for the proposal
      await governor.connect(voter1).castVote(proposalId, 1);
      await governor.connect(voter2).castVote(proposalId, 1);

      // Check the proposal state (should be Succeeded)
      await ethers.provider.send("evm_increaseTime", [5 * 60 * 60]); // Advance 5 hours
      await ethers.provider.send("evm_mine");
      expect(await governor.state(proposalId)).to.equal(4); // 4 = Succeeded

      // Queue the proposal
      await governor.queue(proposalId);

      // Advance the block time to pass the timelock delay
      await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]); // 2 days
      await ethers.provider.send("evm_mine");

      // Execute the proposal
      await governor.execute(proposalId);

      // Check if the executor received the minted tokens
      expect(await token.balanceOf(executor.address)).to.equal(parseEther("100"));
    });
  });


async function increaseTime(duration) {
  await ethers.provider.send("evm_increaseTime", [duration]);
  await ethers.provider.send("evm_mine", []);
}

async function mineBlocks(n) {
  for (let i = 0; i < n; i++) {
    await ethers.provider.send("evm_mine", []);
  }
}
