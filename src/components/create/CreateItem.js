import React, { useState } from "react";
import "../../styles/create/CreateItem.css";
import { Web3Storage } from "web3.storage";
import { MARKETPLACE_ADDRESS } from "../Contract";
import { marketplaceInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import createNftVideo from "../../assets/Create.mp4";

function CreateItem() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    // price: "",
    image: "",
  });
  const { address } = useAccount();
  const navigate = useNavigate();
  const [btnloading, setbtnloading] = useState(false);

  const client = new Web3Storage({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRlNzYyMGRhREFGMkY4NkYwRDI5ZjRDNjAzYzc1OUQ0NzA3ZmMwOEMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTYwNDU2OTE1MjEsIm5hbWUiOiJBdmF0YXIgTWFya2V0cGxhY2UifQ.Ah1bVnoYkUJgwb5yKoyk7nauBa5yHwjHbTsnxILlKAE",
  });

  const uploadNft = async () => {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      // Pack files into a CAR and send to web3.storage
      console.log("ipfs client: ", client);
      const rootCid = await client.put(fileInput.files, {
        name: formData.image.name,
        maxRetries: 3,
      });
      console.log(formData);
      return rootCid + "/" + fileInput.files[0].name;
    } catch (e) {
      console.log(e);
    }
  };

  const handleMintNFT = async () => {
    try {
      setbtnloading(true);
      const cid = await uploadNft();
      console.log("cid: ", cid);

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await marketplaceInstance();
        console.log("Hello");
        const tx = await con.mintNFT(
          formData.quantity,
          cid,
          formData.name,
          formData.description
        );

        console.log(tx);
        await tx.wait();
        setbtnloading(false);
        navigate("/");
      }
    } catch (e) {
      console.log("Error in creating user account: ", e);
    }
  };

  return (
    <div className="col-lg-6 col-7 mx-auto py-4">
      <div className="mb-3">
        <label className="form-label">
          Upload Avatar <span style={{ color: "red" }}>*</span>
        </label>
        <input
          className="form-control form-control-md"
          type="file"
          onChange={(e) => {
            setFormData({
              ...formData,
              image: e.target.value,
            });
          }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => {
            setFormData({
              ...formData,
              name: e.target.value,
            });
          }}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Description <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          className="form-control"
          rows="3"
          value={formData.description}
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value,
            });
          }}
        ></textarea>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Quantity <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={formData.quantity}
          onChange={(e) => {
            setFormData({
              ...formData,
              quantity: e.target.value,
            });
          }}
        />
      </div>
      {/* <div className="mb-3">
        <label className="form-label">
          Price <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={formData.price}
          onChange={(e) => {
            setFormData({
              ...formData,
              price: e.target.value,
            });
          }}
        />
      </div> */}
      <div className="d-grid">
        <button
          type="button"
          className="btn btn-lg btn-danger"
          onClick={handleMintNFT}
        >
          {btnloading ? (
            <>
              <SyncLoader color="#fff" size={12} speedMultiplier={0.8} />
            </>
          ) : (
            <>Mint</>
          )}
        </button>
      </div>
      <div>
        <video controls width="400" height="260" className="video-style">
          <source src={createNftVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default CreateItem;
