"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || "";
        const isAdmin = email.toLowerCase() === "kings.iiita@gmail.com";
        const isAllowed = isAdmin || email.toLowerCase().endsWith("@iiita.ac.in");

        if (isAllowed) {
          setUser({ ...firebaseUser, isAdmin });
        } else {
          firebaseSignOut(auth);
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Only accounts ending with @iiita.ac.in are permitted.",
          });
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      let description = "Could not sign in with Google. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        description = "Sign-in popup was closed before completing. Please try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        description = "Multiple sign-in attempts detected. Please try again.";
      }
      toast({
        variant: "destructive",
        title: "Sign-in Failed",
        description: description,
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Sign-out Failed",
        description: "Could not sign out. Please try again.",
      });
    }
  };

  const value = { user, loading, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
