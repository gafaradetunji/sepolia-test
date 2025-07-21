"use client";
import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"];

export default function Home() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGetLoading, setIsGetLoading] = useState(false);

  async function requestAccount() {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      throw new Error("Please install MetaMask to use this application.");
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (!text) {
        throw new Error("Please enter a message before setting.");
      }

      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.setMessage(text, { gasLimit: 100000 });
      await tx.wait();
      setError(null);
      alert("Message set successfully!");
      setText("");
      // await handleGet();
    } catch (error) {
      setError(error.message || "An error occurred while setting the message.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGet = async () => {
    setError(null);
    setIsGetLoading(true);
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error("Please install MetaMask to use this application.");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const result = await contract.getMessage();
      setMessage(result);
      setError(null);
    } catch (error) {
      setError(error.message || "Failed to retrieve message.");
    } finally {
      setIsGetLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Smart Contract Message App
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          disabled={isLoading}
        />
        <button
          onClick={handleSet}
          disabled={isLoading}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Set Message"}
        </button>
        <button
          onClick={handleGet}
          disabled={isGetLoading}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            backgroundColor: isGetLoading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isGetLoading ? "not-allowed" : "pointer",
          }}
        >
          {isGetLoading ? "Loading..." : "Get Message"}
        </button>
        {message && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Current Message:</h3>
            <p style={{ wordBreak: "break-word", background: "#f8f9fa", padding: "1rem", borderRadius: "4px", color: "green" }}>
              {isLoading ? "Loading..." : message || "No message set."}
            </p>
          </div>
        )}
        {error && (
          <p style={{ color: "red", marginTop: "1rem", maxHeight: '400px', overflowY: 'auto' }}>
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}
