import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Verify() {
  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Extract the verification token from URL
        const token_hash = params.get("token_hash");
        const type = params.get("type") || "signup";

        if (!token_hash) {
          setMessage("Invalid verification link.");
          setLoading(false);
          return;
        }

        // Verify token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        if (error) {
          console.error(error);
          setMessage("Verification failed or link expired.");
        } else {
          setSuccess(true);
          setMessage("✅ Email successfully verified! Redirecting...");
          // Redirect to login after a few seconds
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        console.error(err);
        setMessage("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">
          Email Verification
        </h1>

        {loading ? (
          <p className="text-gray-400 animate-pulse">{message}</p>
        ) : (
          <p
            className={`text-lg font-semibold ${
              success ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {!success && !loading && (
          <button
            onClick={() => navigate("/login")}
            className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
