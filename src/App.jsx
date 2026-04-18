import "@/App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HashRouter , Routes, Route} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Subjects from "@/pages/Subjects";
import Tutors from "@/pages/Tutors";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import Resources from "@/pages/Resources";
import Bursary from "@/pages/Bursary";
import Marketplace from "@/pages/Marketplace";
import MarketplaceBasket from "@/pages/MarketplaceBasket";
import MarketplaceWishlist from "@/pages/MarketplaceWishlist";
import Funding from "@/pages/Funding";
import {
  MarketplaceAddedBannerProvider,
  MarketplaceAddedBanners,
} from "@/context/MarketplaceAddedBannerContext";

export default function App() {
  return (
    <div className="App min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      {/* <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources/>}/>
        </Routes>
        <Footer />
        <Toaster position="top-center" />
      </BrowserRouter> */}

       <HashRouter basename="/">
        <MarketplaceAddedBannerProvider>
        <Header />
        <MarketplaceAddedBanners />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources/>}/>
          <Route path="/bursary" element={<Bursary/>}/>
          <Route path="/marketplace" element={<Marketplace/>}/>
          <Route path="/marketplace/basket" element={<MarketplaceBasket/>}/>
          <Route path="/marketplace/wishlist" element={<MarketplaceWishlist/>}/>
          <Route path="/funding" element={<Funding/>}/>
        </Routes>
        <Footer />
        <Toaster position="top-center" />
        </MarketplaceAddedBannerProvider>
      </HashRouter>
    </div>
  );
}

