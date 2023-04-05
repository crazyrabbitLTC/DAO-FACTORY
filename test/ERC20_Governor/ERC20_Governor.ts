import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { erc20GovernorBehaviorTests } from "./ERC20_Governor.behavior";
import { erc20GovernorFixture } from "./ERC20_Governor.fixture";
import { MyGovernor } from "../../types/contracts/OZGovernor/ERC20/ERC20_GOVERNOR.sol";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe("MyGovernor", function () {
    beforeEach(async function () {
      const signers: SignerWithAddress[] = await ethers.getSigners();
      const admin: SignerWithAddress = signers[0];

     this.ERC20_Governor_Fixture = await this.loadFixture(erc20GovernorFixture);
     const { token,
      timelock,
      governorFactory,
      cancelRoleAddresses,
      votingDelay, votingPeriod, proposalThreshold, quorumFraction } = this.ERC20_Governor_Fixture;

      this.governor = <MyGovernor>await governorFactory.connect(admin).deploy(
        token.address,
        timelock.address,
        cancelRoleAddresses,
        votingDelay,
        votingPeriod,
        proposalThreshold,
        quorumFraction
      );

    });

    erc20GovernorBehaviorTests();
  });
});
