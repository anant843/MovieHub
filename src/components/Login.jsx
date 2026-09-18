import { useState, useRef, useEffect } from "react";
import { BG_Img } from "../utils/constants";
import MovieHubLogo from "./MovieHubLogo";
import { dataValidation } from "../utils/dataValidation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { Link, useLocation } from "react-router-dom";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const location = useLocation();

  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const userName = useRef(null);

  useEffect(() => {
    if (location.state?.email && email.current) {
      email.current.value = location.state.email;
    }
  }, [location.state]);

  const formDataValidation = () => {
    const userEmail = email.current?.value || "";
    const userPass = password.current?.value || "";

    const message = dataValidation(userEmail, userPass);
    setErrorMsg(message);

    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, userEmail, userPass)
        .then((userCredential) => {
          const user = userCredential.user;
          const nameVal = userName.current?.value || "Member";
          updateProfile(user, { displayName: nameVal })
            .then(() => {
              const { email, uid, displayName } = auth.currentUser;
              dispatch(addUser({ uid, email, displayName }));
            })
            .catch((error) => {
              setErrorMsg(error.message);
            });
        })
        .catch((error) => {
          setErrorMsg(error.code + " " + error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, userEmail, userPass)
        .then(() => {
          // Signed in successfully
        })
        .catch((error) => {
          setErrorMsg(error.code + " " + error.message);
        });
    }
  };

  const toggleForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMsg(null);
  };

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
      style={{ backgroundImage: BG_Img }}
    >
      <div className="absolute inset-0 bg-black/80 z-0"></div>

      <Link to="/" className="absolute top-5 left-5 z-20">
        <MovieHubLogo size="lg" />
      </Link>

      <div className="relative z-10 flex items-center justify-center flex-col text-white bg-black/75 h-fit w-11/12 max-w-md p-8 md:p-12 rounded-2xl border border-neutral-800 shadow-2xl backdrop-blur-sm">
        <h2 className="text-white text-2xl md:text-3xl text-center font-bold mb-8">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            formDataValidation();
          }}
          className="flex flex-col items-center justify-center w-full space-y-4"
        >
          {!isSignInForm && (
            <input
              type="text"
              ref={userName}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-700 rounded-lg outline-none bg-gray-900/90 text-white placeholder-gray-400 focus:border-red-500"
            />
          )}
          <input
            type="email"
            ref={email}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-700 rounded-lg outline-none bg-gray-900/90 text-white placeholder-gray-400 focus:border-red-500"
          />
          <input
            type="password"
            ref={password}
            placeholder="Password"
            className="w-full p-3 border border-gray-700 rounded-lg outline-none bg-gray-900/90 text-white placeholder-gray-400 focus:border-red-500"
          />

          {errorMsg && (
            <p className="text-red-500 text-xs text-left w-full font-medium">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mt-2 w-full transition-colors cursor-pointer"
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p
          className="mt-8 cursor-pointer text-gray-400 text-sm hover:text-white transition-colors"
          onClick={toggleForm}
        >
          {isSignInForm ? (
            <>
              New to MovieHub? <span className="text-white font-semibold underline">Sign up now.</span>
            </>
          ) : (
            <>
              Already registered? <span className="text-white font-semibold underline">Sign in now.</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;