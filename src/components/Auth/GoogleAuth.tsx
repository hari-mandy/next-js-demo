"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/queries/register-user";
import { GET_AUTH_TOKEN } from "@/queries/get-auth-token";

export default function GoogleAuth({ redirectTo = "/" }: { redirectTo?: string }) {
  const router = useRouter();
  const [registerUser] = useMutation(REGISTER_USER);
  const [getAuthToken] = useMutation(GET_AUTH_TOKEN);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔹 Register user in WordPress if needed
      if (redirectTo === "/login") {
        await registerUser({
          variables: {
            username: user.displayName || user.email?.split("@")[0],
            email: user.email,
            password: user.uid, // Using UID as password for linking
          },
        });
      }

      // 🔹 Get auth token from WP
      const { data } = await getAuthToken({
        variables: {
          username: user.displayName || user.email?.split("@")[0],
          password: user.uid,
        },
      });

      if (data?.login?.authToken) {
        document.cookie = `authToken=${data.login.refreshToken}; path=/`;
        toast.success("Signed in with Google!");
        setTimeout(() => router.push(redirectTo), 1000);
      } else {
        toast.error("Failed to retrieve authentication token.");
      }
    } catch (err: any) {
      console.error(err);
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
