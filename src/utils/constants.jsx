export const Netflix_Logo =
  "https://help.nflxext.com/helpcenter/OneTrust/oneTrust_production_2025-07-24/consent/87b6a5c0-0104-4e96-a291-092c11350111/019808e2-d1e7-7c0f-ad43-c485b7d9a221/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const BG_Img =
  "url('https://i.redd.it/zjgs096khv591.jpg')";

// TMDB API
export const TMDB_BASE = "https://api.themoviedb.org/3";

// TMDB Images
export const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

// API Headers
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
};

// Languages
export const SUPPORTED_LANGUAGES = [
  {
    identifier: "en",
    name: "English",
    flag: "🇺🇸",
    native: "English",
  },
  {
    identifier: "hindi",
    name: "हिंदी",
    flag: "🇮🇳",
    native: "Hindi",
  },
  {
    identifier: "spanish",
    name: "Español",
    flag: "🇪🇸",
    native: "Spanish",
  },
  {
    identifier: "french",
    name: "Français",
    flag: "🇫🇷",
    native: "French",
  },
  {
    identifier: "german",
    name: "Deutsch",
    flag: "🇩🇪",
    native: "German",
  },
];