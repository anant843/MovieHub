import { Link, useNavigate } from "react-router-dom";
import { BG_Img } from "../utils/constants";
import MovieHubLogo from "./MovieHubLogo";
import { useState } from "react";

const Hero = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleGetStarted = (e) => {
    e.preventDefault();
    navigate("/login", { state: { email } });
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat h-screen"
      style={{ backgroundImage: BG_Img }}
    >
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      <div className="relative z-10 p-5">
        <ul className="flex justify-between items-center z-10 max-w-7xl mx-auto">
          <li>
            <Link to="/">
              <MovieHubLogo size="lg" />
            </Link>
          </li>
          <li>
            <Link to="/login">
              <button className="bg-red-600 hover:bg-red-700 transition-colors px-6 py-2 rounded-lg font-semibold text-white cursor-pointer">
                Sign In
              </button>
            </Link>
          </li>
        </ul>
      </div>

      <div className="absolute inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10 w-11/12 max-w-3xl">
        <h1 className="md:text-5xl text-3xl font-extrabold tracking-tight mb-4">
          Unlimited movies, TV shows and more
        </h1>
        <h3 className="md:text-2xl text-lg font-medium text-gray-200 mb-4">
          Starts at ₹149. Cancel at any time.
        </h3>
        <p className="text-sm md:text-base text-gray-300 mb-6">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:w-80 px-4 py-3 bg-black/60 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 transition-colors rounded-md py-3 px-8 text-base font-bold text-white cursor-pointer flex items-center justify-center"
          >
            Get Started &gt;
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;