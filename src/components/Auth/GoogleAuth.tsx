"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

export default function GoogleAuth({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      setTimeout(() => router.push(redirectTo), 2000);
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed. Try again.");
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outlined"
      fullWidth
      startIcon={<FcGoogle className="text-xl" />}
      sx={{ mt: 2, textTransform: "none" }}
    >
      Continue with Google
    </Button>
  );
}
