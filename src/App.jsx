import { Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Browse from "./components/Browse";
import Login from "./components/Login";
import Hero from "./components/Hero";
import { useEffect } from "react";
import { auth } from "./utils/firebase";
import { addUser, removeUser } from "./store/userSlice";
import { useDispatch } from "react-redux";
import Error from "./components/Error";
import MovieViewPage from "./components/MovieViewPage";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function — always clean it up
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, uid, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    // Cleanup the listener on unmount to prevent memory leaks and
    // duplicate calls in React StrictMode (which mounts twice in dev)
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/login" element={<Login />} />
      <Route path="/error" element={<Error />} />
      <Route path="/browse/view" element={<MovieViewPage />} />
    </Routes>
  );
};

export default App;
