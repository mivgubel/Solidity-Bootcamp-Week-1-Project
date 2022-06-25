// import { ethers } from "hardhat";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { Ballot } from "../../typechain";
import { Contract, ethers } from "ethers";
import { ethers as eth } from "hardhat";

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

  const accounts = await eth.getSigners();
  // Check if the user pass the address contract parameter
  if (process.argv.length < 3) {
    throw new Error("Ballot address missing");
  }
  const ballotAddress = process.argv[2];
  // check if the user pass the index of the proposal
  if (process.argv.length < 4) {
    throw new Error("Index of proposal missing");
  }
  const indexProposal = process.argv[3];
  console.log(`Voting for the Proposal number: ${indexProposal}`);
  try {
    const ballotContract: Ballot = new Contract(
      ballotAddress,
      ballotJson.abi,
      signer
    ) as Ballot;
    // const tx = await ballotContract.connect(accounts[1]).vote(indexProposal);
    const tx = await ballotContract.vote(indexProposal);
    console.log("Awaiting confirmations");
    await tx.wait();
  } catch (err) {
    console.log(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
