import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { Ballot } from "../../typechain";

async function main() {
  const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  if (process.argv.length < 3) throw new Error("Ballot address missing");

  const ballotAddress = process.argv[2];

  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;

  console.log("Getting Proposals: \n");

  let indexAvailable = true;
  let i = 0;
  while (indexAvailable) {
    try {
      const proposal = await ballotContract.proposals(i);
      console.log(
        "Proposal Name: ",
        ethers.utils.parseBytes32String(proposal[0])
      );
      console.log("Vote Count: ", Number(proposal[1]));
      i++;
    } catch (error) {
      indexAvailable = false;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
