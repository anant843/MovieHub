import React from "react";

const MovieHubLogo = ({ className = "", size = "md", onClick }) => {
  // Height classes matching original Netflix logo (original was w-24 md:w-36)
  const sizeClasses = {
    sm: "h-6 md:h-8",
    md: "h-7 md:h-9",
    lg: "h-9 md:h-12",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-block cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      title="MovieHub"
    >
      <svg
        viewBox="0 0 190 42"
        className={`${sizeClasses[size] || sizeClasses.md} w-auto overflow-visible`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gentle upward curve matching the iconic Netflix arc */}
          <path id="moviehub-arc" d="M 5,36 Q 95,29 185,36" />
          {/* Subtle Netflix shadow filter */}
          <filter id="netflix-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>
        <text
          fill="#E50914"
          fontFamily="'Bebas Neue', Impact, 'Arial Black', sans-serif"
          fontSize="36"
          fontWeight="900"
          letterSpacing="2.5"
          filter="url(#netflix-glow)"
        >
          <textPath href="#moviehub-arc" startOffset="50%" textAnchor="middle">
            MOVIEHUB
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default MovieHubLogo;
