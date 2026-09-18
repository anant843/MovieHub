import MovieHubLogo from "./MovieHubLogo";
import { FaUserTie, FaBars, FaTimes } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleGptSearch } from "../store/gptSlice";
import { toggleNavItems } from "../store/configSlice";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const showGptsearch = useSelector((state) => state.gpt.showGptSearch);
  const navbarDisplay = useSelector((state) => state.config.showNavItems);
  const dispatch = useDispatch();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", targetId: null },
    { label: "TV Shows", targetId: "tv-shows" },
    { label: "Movies", targetId: "movies-section" },
    { label: "My List", targetId: "my-list" },
  ];

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        navigate("/error");
      });
  };

  const handleGptSearch = () => {
    if (location.pathname !== "/browse") {
      navigate("/browse");
    }
    dispatch(toggleGptSearch());
  };

  const handleNavClick = (item) => {
    if (navbarDisplay) {
      dispatch(toggleNavItems());
    }

    if (showGptsearch) {
      dispatch(toggleGptSearch());
    }

    if (location.pathname !== "/browse") {
      navigate("/browse");
    }

    setTimeout(() => {
      if (!item.targetId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(item.targetId);
        if (el) {
          const navbarHeight = 85;
          const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementTop - navbarHeight),
            behavior: "smooth",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }, 100);
  };

  const handleLogoClick = () => {
    if (showGptsearch) dispatch(toggleGptSearch());
    if (location.pathname !== "/browse") navigate("/browse");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-neutral-950/90 backdrop-blur-md shadow-2xl border-b border-neutral-800/60 py-3"
          : "bg-gradient-to-b from-black/95 via-black/50 to-transparent py-4"
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-12 text-white">
        <div className="flex items-center space-x-8">
          <MovieHubLogo onClick={handleLogoClick} size="md" />

          {/* Desktop Nav Items */}
          <ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
            {navItems.map((item) => (
              <li
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="cursor-pointer hover:text-white transition-colors duration-150 select-none hover:drop-shadow-sm"
              >
                {item.label}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Hamburger */}
          <button
            className="md:hidden text-lg text-white p-1 cursor-pointer"
            onClick={() => dispatch(toggleNavItems())}
            aria-label="Toggle navigation"
          >
            {navbarDisplay ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm py-2 px-3 md:px-4 rounded-lg font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            onClick={handleGptSearch}
          >
            {showGptsearch ? "🏠 Home" : "✨ AI Search"}
          </button>

          {/* User Info & Sign Out (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center text-sm text-gray-300 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800">
              <FaUserTie className="mr-2 text-xs text-purple-400" />
              <span className="max-w-[120px] truncate text-xs font-medium">
                {user?.displayName || "Member"}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white bg-neutral-900/90 hover:bg-red-600 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-neutral-800 hover:border-transparent"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Sign Out */}
          <div className="md:hidden flex">
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white text-xs py-1.5 px-3 rounded-lg font-medium cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {navbarDisplay && (
        <ul className="text-white bg-neutral-950/95 backdrop-blur-md z-40 relative flex flex-col items-center py-4 space-y-3 md:hidden border-b border-neutral-800 animate-fadeIn mt-3">
          {navItems.map((item) => (
            <li
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="cursor-pointer py-1.5 text-sm font-medium hover:text-red-500 transition-colors w-full text-center"
            >
              {item.label}
            </li>
          ))}
          {user?.displayName && (
            <li className="text-xs text-gray-400 pt-2 border-t border-neutral-800 w-3/4 text-center">
              Signed in as: {user.displayName}
            </li>
          )}
        </ul>
      )}
    </header>
  );
};

export default Header;