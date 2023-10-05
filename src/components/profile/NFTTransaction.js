import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { marketplaceInstance } from "../Contract";
import { useAccount } from "wagmi";
import "../../styles/profile/NFTTransaction.css";
import { ClipLoader } from "react-spinners";
import transactionVideo from "../../assets/Transactions.mp4";

function NFTTransaction() {
  const { address } = useAccount();
  const [allUserTransactions, setAllUserTransactions] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const getOwnedNFTs = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await marketplaceInstance();
        const getOwnedNFTsDetails = await con.getUserTransactions(address);

        console.log("User Transactions: ", getOwnedNFTsDetails);
        setAllUserTransactions(getOwnedNFTsDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchOwnedNFTs() {
      await getOwnedNFTs();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchOwnedNFTs();
  }, []);

  function hexToTimestamp(hex) {
    const unixTimestamp = parseInt(hex, 16);
    const date = new Date(unixTimestamp * 1000);
    const localDate = date.toLocaleString("en-US");
    return localDate;
  }

  return (
    <div className="py-4">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#fff" />
        </div>
      ) : allUserTransactions.length > 0 ? (
        allUserTransactions.map((item, key) => (
          <div className="py-3 my-4 col-11 mx-auto transaction-component">
            <div className="d-flex">Creator: {item.creator}</div>
            <div className="d-flex">Seller: {item.seller}</div>
            <div className="d-flex">
              Quantity: {parseInt(item.quantity._hex, 16)}
            </div>
            <div className="d-flex">
              Price of each: {parseInt(item.price._hex, 16)}
            </div>
            <div className="d-flex">
              Timestamp: {hexToTimestamp(item.timestamp._hex)}
            </div>
          </div>
        ))
      ) : (
        <div>You have no transactions.</div>
      )}

      <div>
        <video controls width="400" height="260" className="video-style">
          <source src={transactionVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default NFTTransaction;
