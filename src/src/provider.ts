import { JsonRpcProvider } from "ethers";

export const provider = new JsonRpcProvider(
  process.env.RPC_URL as string
);
