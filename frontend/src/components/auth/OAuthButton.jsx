import React from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import Button from "@/components/ui/Button.jsx";

export default function OAuthButton() {
  return (
    <div
      id="oauth"
      className="mt-6 flex w-full max-w-md flex-col items-center justify-center gap-y-5"
    >
      <p className="font-black text-muted-foreground mb-5">Or</p>
      <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
        <Button
          variant="outline"
          size="md"
          href="/auth/google"
          className="flex h-11 w-full items-center justify-center gap-3"
        >
          <FaGoogle />
          Google
        </Button>
        <Button
          variant="outline"
          href="/auth/apple"
          size="md"
          className="flex h-11 w-full items-center justify-center gap-3"
        >
          <FaApple />
          Apple
        </Button>
      </div>
    </div>
  );
}
