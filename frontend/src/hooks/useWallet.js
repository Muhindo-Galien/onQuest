import { useState } from 'react';
import Web3 from 'web3';

export default function useWallet() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem("walletConnected") === "true";
  });

  const getBalance = async (address) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          localStorage.setItem("walletConnected", "true");
          getBalance(accounts[0]);
        } else {
          handleDisconnect();
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        handleDisconnect();
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem("walletConnected", "true");
        getBalance(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        handleDisconnect();
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleDisconnect = () => {
    setAccount("");
    setBalance("0");
    setIsConnected(false);
    localStorage.removeItem("walletConnected");
  };

  return {
    account,
    balance,
    isConnected,
    connectWallet,
    handleDisconnect,
    checkWalletConnection
  };
} 