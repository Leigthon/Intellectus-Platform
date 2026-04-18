import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "src/components/ui/sonner";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import Home from "src/pages/Home";
import About from "src/pages/About";
import Subjects from "src/pages/Subjects";
import Tutors from "src/pages/Tutors";
import Pricing from "src/pages/Pricing";
import Contact from "src/pages/Contact";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;