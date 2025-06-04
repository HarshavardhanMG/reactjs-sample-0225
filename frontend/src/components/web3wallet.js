import React, { useState } from 'react';
import Web3 from 'web3';

export default function Web3Wallet() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        alert('User denied wallet connection');
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.substring(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
    </div>
  );
}