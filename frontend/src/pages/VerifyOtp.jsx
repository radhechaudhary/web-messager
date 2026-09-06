import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

const maskEmail = (email) => {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(user.length - 1, 3))}@${domain}`;
};

const VerifyOtp = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name, password } = location.state || {};

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email || !name || !password) {
      navigate("/register", { replace: true });
    }
  }, [email, name, password, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      clean.split("").forEach((char, offset) => {
        if (index + offset < OTP_LENGTH) next[index + offset] = char;
      });
      return next;
    });

    const nextIndex = Math.min(index + clean.length, OTP_LENGTH - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      pasted.split("").forEach((char, i) => {
        next[i] = char;
      });
      return next;
    });
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== OTP_LENGTH) {
      setError("Enter all 6 digits");
      return;
    }

    setError("");
    setNotice("");
    setVerifying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify_otp`,
        { email, otp },
        { withCredentials: true }
      );
      setUser({ email, name: response.data.name || name });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setResending(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        { email, name, password },
        { withCredentials: true }
      );
      setNotice("A new code has been sent to your email.");
      setDigits(Array(OTP_LENGTH).fill(""));
      setCooldown(RESEND_COOLDOWN);
      focusInput(0);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend the code");
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <span aria-hidden="true">&larr;</span> Back
        </Link>

        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Verify your email</h1>
        <p className="text-sm text-slate-500 mb-6">
          Enter the 6-digit code we sent to <span className="font-medium text-slate-700">{maskEmail(email)}</span>
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 text-red-600 text-sm px-3 py-2">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 rounded-md bg-green-50 text-green-700 text-sm px-3 py-2">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={OTP_LENGTH}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 text-center text-lg font-semibold rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full rounded-md bg-indigo-600 text-white text-sm font-medium py-2 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {verifying ? "Verifying..." : "Verify and continue"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-500">
          Didn&apos;t get a code?{" "}
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="text-indigo-600 font-medium hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
