import React, { useState, useEffect } from "react";
import "../../styles/buy/Buy.css";
import close from "../../assets/close.png";
import { ethers } from "ethers";
import { marketplaceInstance } from "../Contract";
import { useAccount } from "wagmi";
import { SyncLoader, ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import buyVideo from "../../assets/Buy.mp4";

function Buy() {
  const [showModal, setShowModal] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState("0");
  const { address } = useAccount();
  const [allNFTsForSale, setAllNFTsForSale] = useState([]);
  const [btnloading, setbtnloading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();

  const [modalData, setModalData] = useState({
    marketId: "",
    quantity: "",
    price: "",
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

  const getNFTsForSale = async () => {
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

        console.log("All sale NFTs: ", getSaleNFTsDetails);
        setAllNFTsForSale(getSaleNFTsDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchSaleNFTs() {
      await getNFTsForSale();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchSaleNFTs();
  }, []);

  const buyNFTs = async () => {
    try {
      setbtnloading(true);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }

        const con = await marketplaceInstance();
        const tx = await con.buyNFT(modalData.marketId, modalData.quantity, {
          value: modalData.quantity * modalData.price,
        });
        console.log("tx: ", tx);
        await tx.wait();
        setbtnloading(false);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log(error.reason);
    }
  };

  return (
    <div className="py-4 d-flex row justify-content-around container-fluid">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#fff" />
        </div>
      ) : allNFTsForSale.length > 0 ? (
        allNFTsForSale.map((item, key) => (
          <div
            className="col-xl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 buy-nft-component"
            // index={key}
          >
            <div className="buy-nft-img-div">
              <a
                onClick={() => {
                  handleImageClick({
                    image: `https://ipfs.io/ipfs/${item.image}`,
                  });
                }}
              >
                <img
                  src={`https://ipfs.io/ipfs/${item.image}`}
                  className="buy-nft-img"
                ></img>
              </a>
            </div>
            <div className="buy-nft-details px-3 py-2">
              <div className="buy-nft-title">{item.name}</div>
              <div className="buy-nft-desc">{item.description}</div>
              <div className="buy-nft-badge">
                Quantity: {parseInt(item.quantity._hex, 16)}
              </div>
              <div className="buy-nft-badge">
                Price of Each: {parseInt(item.price._hex, 16)}
              </div>
            </div>
            <div className="d-grid">
              <button
                type="button"
                className="btn buy-nft-btn"
                data-bs-toggle="modal"
                data-bs-target={`#exampleModal-${key}`}
              >
                Buy
              </button>

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
                      <h5
                        className="modal-title"
                        id={`exampleModalLabel-${key}`}
                      >
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
                                marketId: parseInt(item.marketId._hex, 16),
                                price: parseInt(item.price._hex, 16),
                              });
                            }}
                          />
                        </div>
                      </form>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={buyNFTs}
                      >
                        {btnloading ? (
                          <>
                            <SyncLoader
                              color="#fff"
                              size={12}
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
          </div>
        ))
      ) : (
        <div>No NFTs Available</div>
      )}

      <div>
        <video controls width="400" height="260" className="video-style">
          <source src={buyVideo} type="video/mp4" />
        </video>
      </div>

      {/* Enlarged image */}
      <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body d-flex">
              <img
                src={enlargedImageSrc}
                className="buy-nft-enlarged-imageStyle"
                alt="enlarged"
              />
              <div
                className="close buy-nft-closeStyle"
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

export default Buy;
