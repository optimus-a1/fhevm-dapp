/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { getContract } from "@/lib/contract";

export default function Home() {
  const [status, setStatus] = useState("Idle");
  const [count, setCount] = useState<string>("?");

  // 连接钱包
  async function connect() {
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    setStatus("Wallet connected");
  }

  // 切换到 Sepolia 网络
  async function switchToSepolia() {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia
      });
      setStatus("Switched to Sepolia");
    } catch (e: any) {
      if (e.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0xaa36a7",
            chainName: "Sepolia",
            nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL],
            blockExplorerUrls: ["https://sepolia.etherscan.io/"]
          }]
        });
        setStatus("Sepolia added");
      } else {
        setStatus("Switch failed: " + e.message);
      }
    }
  }

  // 调用 increment()
  async function increment() {
    try {
      const c = await getContract();
      const tx = await c.incrementPlain();
      setStatus("Pending: " + tx.hash);
      await tx.wait();
      setStatus("Confirmed");
    } catch (e: any) {
      setStatus("Error: " + (e?.shortMessage || e?.message));
    }
  }

  // 调用 decrement()
  async function decrement() {
    try {
      const c = await getContract();
      const tx = await c.decrementPlain();
      setStatus("Pending: " + tx.hash);
      await tx.wait();
      setStatus("Confirmed");
    } catch (e: any) {
      setStatus("Error: " + (e?.shortMessage || e?.message));
    }
  }

  // 调用 getCount()
  async function readCount() {
    try {
      const c = await getContract();
      const v = await c.getCountPlain();
      setCount(v?.toString?.() ?? String(v));
      setStatus("Read success");
    } catch (e: any) {
      setStatus("Error: " + (e?.shortMessage || e?.message));
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Zama FHEVM Demo</h1>
      <p className="text-sm opacity-70 mt-1">
        Contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
      </p>

      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 border rounded" onClick={connect}>Connect Wallet</button>
        <button className="px-3 py-2 border rounded" onClick={switchToSepolia}>Switch to Sepolia</button>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 border rounded" onClick={increment}>Increment</button>
        <button className="px-3 py-2 border rounded" onClick={decrement}>Decrement</button>
        <button className="px-3 py-2 border rounded" onClick={readCount}>Read Count</button>
      </div>

      <p className="mt-4">Count: <b>{count}</b></p>
      <p className="mt-2">Status: {status}</p>
      <p className="mt-6 text-sm opacity-70">Network: Sepolia</p>
    </main>
  );
}
