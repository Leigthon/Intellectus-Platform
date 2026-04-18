import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
       const form = document.getElementById('login');
       const email = form.email.value.trim();
       const password = form.password.value;


       //Debug code
       console.log("DEBUG LOGIN ATTEMPT ────────────────────");
       console.log("Email   :", email);
       console.log("Password:", password);
       console.log("────────────────────────────────────────");
      //

      if(email==="leigthonmessina2@gmail.com" && password==="password"){
        // window.location.href="/Bursary";
        navigate("/bursary");
        return;
      }

      else if(email==="student@gmail.com" && password==="password"){
        window.location.href="https://www.testpapers.co.za/";
        return;
      }
      setStatusMessage(`Login is not wired to a backend yet. (Demo – ${email} / ${password})`);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background organic shapes */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] opacity-50 pointer-events-none">
        <svg viewBox="0 0 800 800" className="w-full h-full">
          <path
            d="M200,0 Q400,150 600,0 T800,200 Q650,400 800,600 T600,800 Q400,650 200,800 T0,600 Q150,400 0,200 T200,0 Z"
            fill="#2c3e73"
            opacity="0.06"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-[900px] h-[900px] opacity-40 pointer-events-none">
        <svg viewBox="0 0 900 900" className="w-full h-full">
          <path
            d="M150,450 Q300,200 450,150 T750,450 Q600,700 450,750 T150,450 Z"
            fill="#1ac8db"
            opacity="0.09"
          />
        </svg>
      </div>

      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] opacity-30 pointer-events-none">
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <circle cx="250" cy="250" r="220" fill="#1ac8db" opacity="0.04" />
          <circle cx="250" cy="250" r="140" fill="#2c3e73" opacity="0.03" />
        </svg>
      </div>

      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/"
              className="text-3xl font-black text-[#2c3e73] tracking-tight hover:text-[#1ac8db] transition"
            >
              IS
            </Link>

            <Link to="/">
              <Button
                variant="ghost"
                className="text-[#2c3e73] hover:text-[#1ac8db] gap-2 text-lg font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Login Content */}
      <main className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-lg w-full">
          <div className="text-center mb-10 space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-[#2c3e73] tracking-tight leading-tight">
              Login
            </h1>
            <p className="text-2xl text-[#1ac8db] font-semibold">
              Welcome Student
            </p>
            <p className="text-gray-600 text-lg font-light max-w-md mx-auto">
              please enter your student details to gain acccess to our resoures
            </p>
          </div>

          <Card className="border border-gray-200/50 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-10 md:p-12">
              <form onSubmit={handleSubmit} id="login" className="space-y-8" autoComplete="on">
                <div className="space-y-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-gray-300/70 bg-white/60 focus:outline-none focus:border-[#1ac8db] focus:ring-2 focus:ring-[#1ac8db]/30 transition text-[#2c3e73] placeholder:text-gray-500 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300/70 bg-white/60 focus:outline-none focus:border-[#1ac8db] focus:ring-2 focus:ring-[#1ac8db]/30 transition text-[#2c3e73] placeholder:text-gray-500 text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1ac8db] hover:bg-[#15a3c0] text-white py-7 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group flex items-center justify-center gap-3"
                >
                  <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Sign In
                </Button>

                <p className="text-center text-sm text-gray-500 mt-6 leading-relaxed">
                  If you are struggling or unsure of your details please contanct your tutor for assistance.<br />
                </p>

                {statusMessage && (
                  <p
                    className="text-center text-base text-amber-700 bg-amber-50/70 py-3 px-4 rounded-xl border border-amber-200 mt-4"
                    aria-live="polite"
                  >
                    {statusMessage}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}