/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserProvider, Contract } from "ethers";
import abi from "@/abi/FHECounter.json";

export async function getContract() {
  if (!(window as any).ethereum) {
    throw new Error("No wallet found. Please install MetaMask.");
  }
  const provider = new BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
  const theAbi: any = (abi as any).abi ?? abi; // 兼容两种导入格式
  return new Contract(address, theAbi, signer);
}
