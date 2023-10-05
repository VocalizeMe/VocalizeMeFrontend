import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../../styles/navbar/Navbar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png"

function Navbar() {
  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-light sticky-top py-2 `}
        role="navigation"
      >
        <div className="container-fluid px-4 px-md-5 navbar ">
          <a className="d-flex navbar-brand" href="/">
            {/* <h1 className="text-light">AVATAR</h1> */}
            <img src={logo} className="img-logo" />
          </a>

          <button
            type="button"
            className="navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around"
            data-bs-toggle="collapse"
            data-bs-target="#navbarRightAlignExample"
            aria-controls="navbarRightAlignExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="toggler-icon top-bar"></span>
            <span className="toggler-icon middle-bar"></span>
            <span className="toggler-icon bottom-bar"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarRightAlignExample"
          >
            <ul className="d-lg-flex navbar-nav align-items-center mb-2 mb-lg-0 navbar-container">
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/buy-nft"
                >
                  <span className="landing-navbar">Buy NFT</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/create-item"
                >
                  <span className="landing-navbar">Create NFT</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <NavLink
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  to="/"
                >
                  <span className="landing-navbar">Profile</span>
                </NavLink>
              </li>
              <li className="nav-item py-2 px-2">
                <ConnectButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
