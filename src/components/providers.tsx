"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
};
