import React, { useState, useEffect } from "react";
import man from "../../assets/man.gif";
import "../../styles/profile/SellNFT.css";
import close from "../../assets/close.png";
import { ethers } from "ethers";
import { marketplaceInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ClipLoader } from "react-spinners";
import sellNftVideo from "../../assets/Sell.mp4";

function SellNFT() {
  const [showModal, setShowModal] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState("0");
  const { address } = useAccount();
  const [allUserNFTsForSale, setAllUserNFTsForSale] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleImageClick = (src) => {
    setShowModal(true);
    setEnlargedImageSrc(src.image);
  };

  const handleCloseClick = () => {
    setShowModal(false);
    setEnlargedImageSrc("");
  };

  const modalStyle = {
    display: showModal ? "block" : "none",
  };

  const getUserNFTsForSale = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await marketplaceInstance();
        const getSaleNFTsDetails = await con.getAllNFTsForSale();

        const filteredDetails = getSaleNFTsDetails.filter((nft) => {
          return nft.seller === address;
        });

        console.log("All sale NFTs of user: ", filteredDetails);
        setAllUserNFTsForSale(filteredDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchSaleNFTsOfUser() {
      await getUserNFTsForSale();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchSaleNFTsOfUser();
  }, []);

  return (
    <div className="py-4 d-flex row justify-content-around container-fluid">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#fff" />
        </div>
      ) : allUserNFTsForSale.length > 0 ? (
        allUserNFTsForSale.map((item, key) => (
          <div
            className="col-xxl-4 col-md-5 col-sm-7 col-11 mx-1 mb-5 sell-nft-component"
            // index={key}
          >
            <div className="sell-nft-img-div">
              <a
                onClick={() => {
                  handleImageClick({
                    image: `https://ipfs.io/ipfs/${item.image}`,
                  });
                }}
              >
                <img
                  src={`https://ipfs.io/ipfs/${item.image}`}
                  className="sell-nft-img"
                ></img>
              </a>
            </div>
            <div className="sell-nft-details px-3 py-2">
              <div className="sell-nft-title">{item.name}</div>
              <div className="sell-nft-desc">{item.description}</div>
              <div className="sell-nft-badge">
                Quantity: {parseInt(item.quantity._hex, 16)}
              </div>
              <div className="sell-nft-badge">
                Price of Each: {parseInt(item.price._hex, 16)}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No NFTs for sale Available</div>
      )}

      <div>
        <video controls width="400" height="260" className="video-style">
          <source src={sellNftVideo} type="video/mp4" />
        </video>
      </div>

      {/* Enlarged image */}
      <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body d-flex">
              <img
                src={enlargedImageSrc}
                className="sell-nft-enlarged-imageStyle"
                alt="enlarged"
              />
              <div
                className="close sell-nft-closeStyle"
                onClick={handleCloseClick}
              >
                <img src={close}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ending */}
    </div>
  );
}

export default SellNFT;
