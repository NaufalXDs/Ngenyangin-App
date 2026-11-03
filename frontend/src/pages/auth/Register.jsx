import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext.jsx";
import { registerSchema } from "../../utils/validation.js";
import OAuthButton from "../../components/auth/OAuthButton.jsx";
import Button from "../../components/Button.jsx";
import Form from "../../components/Form.jsx";
import Alert from "../../components/Alert.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    const validationResult = registerSchema.safeParse({ name, email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      await signUp({ name, email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-orange-50">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-3 py-2 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10 lg:px-6 xl:gap-20">
        <div className="relative hidden min-h-80 w-full overflow-hidden rounded-2xl lg:block lg:w-[46%] xl:w-[45%]">
          <img
            src="/banner.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <span
              aria-hidden="true"
              className="mb-1 block font-serif text-5xl leading-none text-[#F3C743]"
            >
              “
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight drop-shadow-md xl:text-4xl">
              Mau makan apa nih? Cari menu fav-mu di sini!
            </h2>
            <p className="mt-2 text-sm text-white/85">
              Bagikan punyamu di Ngenyangin!
            </p>
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
              Login
            </Link>
            <Link
              to="/auth/register"
              className={`flex-1 min-w-0 text-center px-3 py-2 sm:px-8 ${pathname === "/auth/register" ? "border-b-[3px] border-[#F3C743]" : "border-b-2 border-[#DED5C3]"}`}
            >
              Register
            </Link>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-1 sm:px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5 sm:p-8">
              <h2 className="mb-6 text-center font-serif text-[28px] text-[#31281F] sm:text-[35px]">
                Register
              </h2>
              {error && (
                <Alert type="error" message={error} className="mb-4" onClose={() => setError("")} />
              )}
              <form onSubmit={handleRegister} className="space-y-4">
                <Form
                  label="Name"
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
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
                  label="Create a Password"
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
                <Form
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="at least 8 characters"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                    Sign Up Account
                    <FaArrowRight />
                  </span>
                </Button>
              </form>
            </div>

            <OAuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
