
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.59,44,30.134,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );
}

export default function LoginPage() {
  const { user, signInWithGoogle, loading, isInitialized, isSigningIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user) {
      router.push("/");
    }
  }, [user, isInitialized, router]);
  
  if (loading || !isInitialized || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Utensils className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Kings Eats</CardTitle>
          <CardDescription>Sign in to place your order</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={signInWithGoogle} disabled={!isInitialized || isSigningIn}>
            {isSigningIn ? (
              "Signing in..."
            ) : (
              <>
                <GoogleIcon />
                Sign in with Google
              </>
            )}
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Only accounts ending with @iiita.ac.in are permitted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
