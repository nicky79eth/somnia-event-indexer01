import { Contract, Log } from "ethers";
import { provider } from "./provider";
import abi from "../abi/contract.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const CONFIRMATIONS = Number(process.env.CONFIRMATIONS || 3);

let lastProcessedBlock = 0;

export async function startIndexer() {
  const contract = new Contract(CONTRACT_ADDRESS, abi, provider);

  const currentBlock = await provider.getBlockNumber();
  if (lastProcessedBlock === 0) {
    lastProcessedBlock = currentBlock - CONFIRMATIONS;
  }

  provider.on("block", async (blockNumber: number) => {
    const fromBlock = lastProcessedBlock + 1;
    const toBlock = blockNumber - CONFIRMATIONS;

    if (toBlock < fromBlock) return;

    const logs = await provider.getLogs({
      address: CONTRACT_ADDRESS,
      fromBlock,
      toBlock
    });

    for (const log of logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        handleEvent(parsed.name, parsed.args, log);
      } catch {}
    }

    lastProcessedBlock = toBlock;
  });

  console.log("[indexer] started");
}

function handleEvent(name: string, args: any, log: Log) {
  console.log({
    event: name,
    blockNumber: log.blockNumber,
    txHash: log.transactionHash,
    args
  });
}
