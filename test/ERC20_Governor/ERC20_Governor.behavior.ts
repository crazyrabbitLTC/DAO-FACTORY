import { expect } from "chai";

export function erc20GovernorBehaviorTests(): void {
  describe("Deployment", function () {
    it("should set the correct token address", async function () {
      const tokenAddress = await this.governor.token();
      expect(tokenAddress).to.equal(this.ERC20_Governor_Fixture.token.address);
    });

    it("should set the correct timelock address", async function () {
      const timelockAddress = await this.governor.timelock();
      expect(timelockAddress).to.equal(this.ERC20_Governor_Fixture.timelock.address);
    });

    // it("should set the correct cancel role addresses", async function () {
    //   for (const [index, cancelRoleAddress] of this.ERC20_Governor_Fixture.cancelRoleAddresses.entries()) {
    //     const roleAddress = await this.governor.getRoleMember(this.governor.CANCEL_ROLE, index);
    //     expect(roleAddress).to.equal(cancelRoleAddress);
    //   }
    // });


    it("should set the correct default admin", async function () {
      const defaultAdmin = await this.governor.getRoleAdmin(await this.governor.CANCEL_ROLE());
      expect(defaultAdmin).to.equal(this.ERC20_Governor_Fixture.defaultAdmin);
    });

    it("should set the correct voting delay", async function () {
      const votingDelay = await this.governor.votingDelay();
      expect(votingDelay).to.equal(this.ERC20_Governor_Fixture.votingDelay);
    });

    it("should set the correct voting period", async function () {
      const votingPeriod = await this.governor.votingPeriod();
      expect(votingPeriod).to.equal(this.ERC20_Governor_Fixture.votingPeriod);
    });

    it("should set the correct proposal threshold", async function () {
      const proposalThreshold = await this.governor.proposalThreshold();
      expect(proposalThreshold).to.equal(this.ERC20_Governor_Fixture.proposalThreshold);
    });

    it("should set the correct quorum fraction", async function () {
      const quorumFraction = await this.governor["quorumNumerator()"]();
      expect(quorumFraction).to.equal(this.ERC20_Governor_Fixture.quorumFraction);
    });
  });

  // Add more behavior tests as needed
}
