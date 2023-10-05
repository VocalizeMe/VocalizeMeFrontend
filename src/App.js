import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import CreateNFT from "./pages/CreateNFT";
import Profile from "./pages/Profile";
import BuyNFT from "./pages/BuyNFT";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/create-item" element={<CreateNFT />}></Route>
          <Route path="/" element={<Profile />}></Route>
          <Route path="/buy-nft" element={<BuyNFT />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
