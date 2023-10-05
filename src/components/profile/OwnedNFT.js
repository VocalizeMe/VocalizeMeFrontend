import React, { useState, useEffect } from "react";
import "../../styles/profile/OwnedNFT.css";
import man from "../../assets/man.gif";
import close from "../../assets/close.png";
import { ethers } from "ethers";
import { marketplaceInstance } from "../Contract";
import { subscriptionInstance } from "../Contract";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { SyncLoader, ClipLoader } from "react-spinners";
import ownedNftVideo from "../../assets/Owned.mp4";

function OwnedNFT() {
  const [showModal, setShowModal] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState("0");
  const { address } = useAccount();
  const [allOwnedNFTs, setAllOwnedNFTs] = useState([]);
  const [btnloading, setbtnloading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [defaultNftValue, setDefaultNftValue] = useState(0);
  const navigate = useNavigate();

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

  const getOwnedNFTsOfUser = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await marketplaceInstance();
        const getOwnedNFTsDetails = await con.getOwnedNFTs(address);

        console.log("All owned NFTs: ", getOwnedNFTsDetails);
        setAllOwnedNFTs(getOwnedNFTsDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchOwnedNFTs() {
      await getOwnedNFTsOfUser();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchOwnedNFTs();
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

  const handleDefaultBtn = async (id) => {
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
        const tokenId = parseInt(id._hex, 16);
        console.log("Token id: ", tokenId);
        const con = await subscriptionInstance();
        const tx = await con.setDefaultNFT(tokenId);

        console.log("Sale NFTs: ", tx);
        console.log(tx);
        await tx.wait();
        setbtnloading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDefaultNftValue = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await subscriptionInstance();
        const defaultNftValue = await con.userDefaultNFT(address);
        const value = parseInt(defaultNftValue._hex, 16);
        console.log("default nft ", value);
        setDefaultNftValue(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getDefaultNftValue();
      // setIsPageLoading(false);
    }
    console.log("hello");
    fetchData();
  }, []);

  return (
    <div className="py-4 d-flex row justify-content-around container-fluid">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#fff" />
        </div>
      ) : allOwnedNFTs.length > 0 ? (
        allOwnedNFTs.map((item, key) => (
          <div
            className="col-xxl-4 col-md-5 col-sm-7 col-11 mx-1 mb-5 owned-nft-component"
            // index={key}
          >
            <div className="owned-nft-img-div">
              <a
                onClick={() => {
                  handleImageClick({
                    image: `https://ipfs.io/ipfs/${item[0].image}`,
                  });
                }}
              >
                <img
                  src={`https://ipfs.io/ipfs/${item[0].image}`}
                  className="owned-nft-img"
                ></img>
              </a>
            </div>
            <div className="owned-nft-details px-3 py-2">
              <div className="owned-nft-title">{item[0].name}</div>
              <div className="owned-nft-desc">{item[0].description}</div>
              <div className="owned-nft-badge">
                Quantity: {parseInt(item[1].quantity._hex, 16)}
              </div>
              <div className="owned-nft-badge">
                Bought price: {parseInt(item[1].price._hex, 16)}
              </div>
            </div>
            <div className="d-grid">
              <div className="btn-group">
                <button
                  className="btn owned-nft-btn"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target={`#exampleModal-${key}`}
                >
                  Sell
                </button>
                <button
                  className="btn owned-nft-defaultbtn"
                  type="button"
                  onClick={() => handleDefaultBtn(item.allNfts.tokenId)}
                >
                  {defaultNftValue === parseInt(item.allNfts.tokenId._hex, 16)
                    ? "Default"
                    : "Set as Default"}
                </button>
              </div>
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
                              tokenId: parseInt(item.allNfts.tokenId._hex, 16),
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
                      onClick={NFTsForSale}
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
        ))
      ) : (
        <div>No Owned NFTs Available</div>
      )}

      <div>
        <video controls width="400" height="260" className="video-style">
          <source src={ownedNftVideo} type="video/mp4" />
        </video>
      </div>

      {/* Enlarged image */}
      <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body d-flex">
              <img
                src={enlargedImageSrc}
                className="owned-nft-enlarged-imageStyle"
                alt="enlarged"
              />
              <div
                className="close owned-nft-closeStyle"
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

export default OwnedNFT;
