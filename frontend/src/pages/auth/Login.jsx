import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { loginSchema } from "../../utils/validation.js";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import OAuthButton from "../../components/auth/OAuthButton.jsx";
import Button from "../../components/Button.jsx";
import Form from "../../components/Form.jsx";
import Alert from "../../components/Alert.jsx";

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

    const validationResult = loginSchema.safeParse({ email, password });
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
    <div className="flex flex-1 flex-col items-center justify-between w-full px-3 py-4 lg:px-0">
      <div
        id="menu-sign"
        className="mx-auto flex w-full max-w-md items-center justify-center gap-2 overflow-x-hidden"
      >
        <Link
          to="/auth/login"
          className={`flex-1 min-w-0 text-center px-3 py-2 sm:px-8 ${pathname === "/auth/login" ? "border-b-[3px] border-primary" : "border-b-2 border-[#DED5C3]"}`}
        >
          Login
        </Link>
        <Link
          to="/auth/register"
          className={`flex-1 min-w-0 text-center px-3 py-2 sm:px-8 ${pathname === "/auth/register" ? "border-b-[3px] border-primary" : "border-b-2 border-[#DED5C3]"}`}
        >
          Register
        </Link>
      </div>

      <div className="my-auto flex w-full max-w-xl flex-col items-center justify-center lg:w-[42%] xl:w-[40%]">
        <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-8">
          <h2 className="mb-6 text-center text-[28px] text-[#31281F] sm:text-[35px] font-black">
            Login
          </h2>
          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-4"
              onClose={() => setError("")}
            />
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <Form
              label="Email"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
            <Form
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="at least 8 characters"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth={true}
              loading={loading}
            >
              <span className="inline-flex items-center justify-center gap-2">
                Login Account
                <FaArrowRight />
              </span>
            </Button>
          </form>
        </div>

        <OAuthButton />
      </div>
    </div>
  );
}
