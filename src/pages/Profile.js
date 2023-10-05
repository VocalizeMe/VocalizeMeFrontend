import React, { useEffect } from "react";
import "../styles/profile/Profile.css";
import { useState } from "react";
import OwnedNFT from "../components/profile/OwnedNFT";
import MintedNFT from "../components/profile/MintedNFT";
import SellNFT from "../components/profile/SellNFT";
import NFTTransaction from "../components/profile/NFTTransaction";
import user from "../assets/user.jpg";
import { useAccount } from "wagmi";

function Profile() {
  const [activeComponent, setActiveComponent] = useState("mintedNft");
  const { address } = useAccount();
  const [shortenedAddress, setShortenedAddress] = useState("");

  const handleMintedNFTClick = async () => {
    setActiveComponent("mintedNft");
  };

  const handleOwnedNFTClick = async () => {
    setActiveComponent("ownedNft");
  };

  const handleSellNFTClick = async () => {
    setActiveComponent("sellNft");
  };

  const handleTransactionClick = async () => {
    setActiveComponent("transactions");
  };

  useEffect(() => {
    if(address){

    
    if (address.length !== 42 || !address.startsWith("0x")) {
      alert("Invalid Ethereum address");
      return;
    }

    const prefix = address.substring(0, 6);
    const suffix = address.substring(address.length - 5);
    const shortened = `${prefix}.....${suffix}`;
    console.log("address: ", shortened);

    setShortenedAddress(shortened);
    console.log(shortenedAddress);
  }
  
});

  return (
    <div className="d-flex py-4 profile-component">
      <div className="col-3">
        <div className="profile-img-class">
          <img src={user} className="profile-img" />
        </div>
        <div className="profile-details">
          <div className="profile-address">Connected Address:</div>
          <div className="profile-address py-2"><strong>{shortenedAddress}</strong></div>
        </div>
      </div>
      <div className="col-9">
        <div className="d-flex justify-content-evenly dash-all-btns">
          <button
            type="button"
            className={`col-2 btn btn-outline-warning mx-sm-3 mx-2 dash-btn ${
              activeComponent === "mintedNft" ? "active-button" : ""
            }`}
            onClick={handleMintedNFTClick}
          >
            Minted NFT
          </button>
          <button
            type="button"
            className={`col-2 btn btn-outline-warning mx-sm-3 mx-2 dash-btn ${
              activeComponent === "ownedNft" ? "active-button" : ""
            }`}
            onClick={handleOwnedNFTClick}
          >
            Owned NFT
          </button>
          <button
            type="button"
            className={`col-2 btn btn-outline-warning mx-sm-3 mx-2 dash-btn ${
              activeComponent === "sellNft" ? "active-button" : ""
            }`}
            onClick={handleSellNFTClick}
          >
            NFT For Sell
          </button>

          <button
            type="button"
            className={`col-2 btn btn-outline-warning mx-sm-3 mx-2 dash-btn ${
              activeComponent === "transactions" ? "active-button" : ""
            }`}
            onClick={handleTransactionClick}
          >
            Transactions
          </button>
        </div>

        <div className="py-3">
          {activeComponent == "mintedNft" ? (
            <MintedNFT />
          ) : activeComponent == "ownedNft" ? (
            <OwnedNFT />
          ) : activeComponent == "sellNft" ? (
            <SellNFT />
          ) : activeComponent == "transactions" ? (
            <NFTTransaction />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
