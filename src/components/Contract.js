import { ethers } from "ethers";
import avatarMarketplaceABI from "../contracts/artifacts/avatarMarketplaceABI.json";
import subscriptionABI from "../contracts/artifacts/subscriptionContractABI.json";

export const MARKETPLACE_ADDRESS = "0x6cF5C20edC5979aE6D7F3529DfeD50a91660df8D";
export const SUBSCRIPTION_ADDRESS = "0x4BCef528011Df3BDc7C2Fa6F7f642B7a9aBA375a";

export const marketplaceInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const con = new ethers.Contract(
      MARKETPLACE_ADDRESS,
      avatarMarketplaceABI,
      signer
    );
    // console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const subscriptionInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const con = new ethers.Contract(
      SUBSCRIPTION_ADDRESS,
      subscriptionABI,
      signer
    );
    // console.log(con);
    return con;
  } else {
    console.log("error");
  }
};