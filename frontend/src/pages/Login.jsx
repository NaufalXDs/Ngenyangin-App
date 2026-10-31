import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signInSchema } from "../utils/validation.js";
import {
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import OauthBTN from "../components/OauthBTN.jsx";
import Navbar from "../components/Navbar.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationResult = signInSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-orange-50">
      <Navbar />

      <div className="flex flex-col justify-center items-center gap-6 px-3 py-2 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10 lg:px-6 xl:gap-20">
        <div className="relative hidden min-h-80 w-full overflow-hidden rounded-2xl lg:block lg:w-[46%] xl:w-[45%]">
          <img
            src="/banner-auth.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <span aria-hidden="true" className="mb-1 block font-serif text-5xl leading-none text-[#F3C743]">
              “
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight drop-shadow-md xl:text-4xl">
              Mau makan apa nih? Cari menu fav-mu di sini!
            </h2>
            <p className="mt-2 text-sm text-white/85">Bagikan punyamu di Ngenyangin!</p>
          </div>
        </div>

        <div className="w-full max-w-xl lg:w-[42%] xl:w-[40%]">
          <div
            id="menu-sign"
            className="mx-auto mb-4 flex w-full max-w-md items-center justify-center gap-2 overflow-x-hidden"
          >
            <Link
              to="/auth/login"
              className={`flex-1 min-w-0 text-center px-3 py-2 sm:px-8 ${pathname === "/auth/login" ? "border-b-[3px] border-[#F3C743]" : "border-b-2 border-[#DED5C3]"}`}
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className={`flex-1 min-w-0 text-center px-3 py-2 sm:px-8 ${pathname === "/auth/register" ? "border-b-[3px] border-[#F3C743]" : "border-b-2 border-[#DED5C3]"}`}
            >
              Sign Up
            </Link>
          </div>

          <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-1 sm:px-4 lg:min-h-[calc(100vh-10rem)]">
            <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-8">
              <h2 className="mb-6 text-center font-serif text-[28px] text-[#31281F] sm:text-[35px]">
                Sign In
              </h2>
              {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold font-sans text-[#31281F]">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="nama@email.com"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold font-sans text-[#31281F]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="at least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute bottom-0 right-3 top-1 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full border border-[#31281F] bg-[#F3C743] text-[15px] font-semibold text-[#31281F] shadow-[4px_4px_0_#31281F] transition hover:bg-[#e8b92e] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {loading ? "Memuat..." : "Sign In Account"}
                    <FaArrowRight />
                  </span>
                </button>
              </form>
            </div>

            <OauthBTN/>
          </div>
        </div>
      </div>
    </div>
  );
}
