import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { Greeter } from "../types/Greeter";
import type { MyGovernor } from "../types/contracts/OZGovernor/ERC20/ERC20_GOVERNOR.sol";
import type { ERC20GovernorFixture } from "./ERC20_Governor/ERC20_Governor.fixture";


type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    greeter: Greeter;
    governor: MyGovernor;
    ERC20_Governor_Fixture: ERC20GovernorFixture; // Add the myGovernor property
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
