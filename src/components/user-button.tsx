"use client";

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const CustomUserButton = () => {
  const { theme } = useTheme();
  return (
    <UserButton
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    />
  );
};

export default CustomUserButton;
