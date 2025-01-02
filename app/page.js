'use client';
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.User.createUser);
  const navigate = useRouter();

  const checkuser = async () => {
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      console.error("User data is incomplete.");
      return; // Exit if user data is not valid
    }

    const userName = user.fullName || "defaultUser"; // Provide a fallback value


    const result = await createUser({
      email: user.emailAddresses[0].emailAddress,
      userName: userName, // Use the fallback value
      imageUrl: user.imageUrl,
    });

    console.log(result);
    navigate.push("/dashboard");
  };

  useEffect(() => {
    if (user) {
      checkuser();
    }
  }, [user]);

  return (
    <div>
      <h2>Hello Kelvin</h2>
      <Button>Subscribe</Button>

      <UserButton />
    </div>
  );
}
