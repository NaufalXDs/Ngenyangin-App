import React from "react";
import { FaApple, FaGoogle } from "react-icons/fa";

export default function OauthBTN() {
  return (
    <div
      id="oauth"
      className="mt-6 flex w-full max-w-md flex-col items-center justify-center gap-y-5"
    >
      <p className="font-sans text-[11px] text-[#6C6257]">Or Sign In With</p>
      <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
        <a
          href="/auth/google"
          className="flex h-11 w-full items-center justify-center gap-3 border-2 border-[#DED5C3] bg-white sm:w-52"
        >
          <FaGoogle />
          Google
        </a>
        <a
          href="/auth/apple"
          className="flex h-11 w-full items-center justify-center gap-3 border-2 border-[#DED5C3] bg-white sm:w-52"
        >
          <FaApple />
          Apple
        </a>
      </div>
    </div>
  );
}
