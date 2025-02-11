import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-lg shadow-lg w-full bg-white text-gray-900"
    >
      <div className="px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          WOW Tournament
        </Link>

        {/* Menu and Theme Toggle */}
        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:flex lg:flex-row lg:space-x-4 absolute lg:relative top-full left-0 w-full bg-white shadow-md lg:shadow-none`}
          >
            <Link
                to="/characters"
                className={`block px-4 py-2 hover:underline text-gray-900 ${
                isActive("/characters") ? "underline" : ""
                }`}
            >
                Characters
            </Link>
            <Link
                to="/teams"
                className={`block px-4 py-2 hover:underline text-gray-900 ${
                    isActive("/teams") ? "underline" : ""
                }`}
                >
                Teams
            </Link>
            <Link
                to="/tournaments"
                className={`block px-4 py-2 hover:underline text-gray-900 ${
                    isActive("/tournaments") ? "underline" : ""
                }`}
                >
                Tournaments
            </Link>
          </nav>

          {/* Hamburger Menu */}
          <button
            className={`lg:hidden block text-gray-900 focus:outline-none`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
