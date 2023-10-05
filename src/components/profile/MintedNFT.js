import React, { useState, useEffect } from "react";
import "../../styles/profile/MintedNFT.css";
import close from "../../assets/close.png";
import { ethers } from "ethers";
import { marketplaceInstance } from "../Contract";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { SyncLoader, ClipLoader } from "react-spinners";
import mintedVideo from "../../assets/Minted.mp4";

function MintedNFT() {
  const [showModal, setShowModal] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState("0");
  const { address } = useAccount();
  const [allMintedNFTs, setAllMintedNFTs] = useState([]);
  const navigate = useNavigate();
  const [btnloading, setbtnloading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [modalData, setModalData] = useState({
    tokenId: "",
    price: "",
    quantity: "",
  });

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

  const getMintedNFTs = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await marketplaceInstance();
        const getMintedNFTsDetails = await con.getMintedNFTsByUser(address);

        console.log("All minted NFTs: ", getMintedNFTsDetails);
        setAllMintedNFTs(getMintedNFTsDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchMintedNFTs() {
      await getMintedNFTs();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchMintedNFTs();
  }, []);

  const NFTsForSale = async () => {
    try {
      setbtnloading(true);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        console.log("modal data: ", modalData);
        const con = await marketplaceInstance();
        const tx = await con.listNFTForSale(
          modalData.tokenId,
          modalData.quantity,
          modalData.price
        );

        console.log("Sale NFTs: ", tx);
        console.log(tx);
        await tx.wait();
        setbtnloading(false);
        navigate("/buy-nft");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-4 d-flex row justify-content-around container-fluid">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#fff" />
        </div>
      ) : allMintedNFTs.length > 0 ? (
        allMintedNFTs.map((item, key) => (
          <div
            className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 minted-nft-component"
            // index={key}
          >
            <div className="minted-nft-img-div">
              <a
                onClick={() => {
                  handleImageClick({
                    image: `https://ipfs.io/ipfs/${item.image}`,
                  });
                }}
              >
                <img
                  // src={`https://gateway.lighthouse.storage/ipfs/${item.uploadImage}`}
                  src={`https://ipfs.io/ipfs/${item.image}`}
                  className="minted-nft-img"
                ></img>
              </a>
            </div>
            <div className="minted-nft-details px-3 py-2">
              <div className="minted-nft-title">{item.name}</div>
              <div className="minted-nft-desc">{item.description}</div>
              <div className="minted-nft-badge">
                Quantity: {parseInt(item.totalSupply._hex, 16)}
              </div>
              {/* <div className="minted-nft-btn">View More &gt;</div> */}
            </div>
            <div className="d-grid">
              <button
                className="btn minted-nft-btn"
                type="button"
                data-bs-toggle="modal"
                data-bs-target={`#exampleModal-${key}`}
              >
                Sell
              </button>
            </div>
            <div
              className="modal fade"
              id={`exampleModal-${key}`}
              tabindex="-1"
              aria-labelledby={`exampleModalLabel-${key}`}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id={`exampleModalLabel-${key}`}>
                      Enter the details
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label modal-form-text">
                          Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label modal-form-text">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              quantity: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label modal-form-text">
                          Price of Each
                        </label>
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              price: e.target.value,
                              tokenId: parseInt(item.tokenId._hex, 16),
                            });
                          }}
                        />
                      </div>
                      {/* <input
                        type="text"
                        value={parseInt(item.tokenId._hex, 16)}
                      ></input> */}
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={NFTsForSale}
                    >
                      {btnloading ? (
                        <>
                          <SyncLoader
                            color="#fff"
                            size={10}
                            speedMultiplier={0.7}
                          />
                        </>
                      ) : (
                        <>Submit</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No Minted NFTs Available</div>
      )}

      <div>
        <video controls width="400" height="260" className="video-style">
          <source src={mintedVideo} type="video/mp4" />
        </video>
      </div>

      {/* Enlarged image */}
      <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body d-flex">
              <img
                src={enlargedImageSrc}
                className="minted-nft-enlarged-imageStyle"
                alt="enlarged"
              />
              <div
                className="close minted-nft-closeStyle"
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

export default MintedNFT;
