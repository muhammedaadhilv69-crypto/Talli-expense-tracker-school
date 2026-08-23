"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const router = useRouter();
  const { logIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.warning("Please enter your email.");
      return;
    }

    if (!password) {
      toast.warning("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await logIn(email.trim(), password);

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        return;
      }

      toast.success("Welcome back!");

      router.replace("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding */}
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10">
            <Link
              href="/"
              className="flex w-fit items-center gap-2 text-xl font-semibold"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/10">
                <WalletCards className="size-5" />
              </div>
              Talli
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
              Welcome back.
            </p>

            <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
              Your money dashboard is waiting.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/70">
              Keep track of your spending, budgets, and savings goals — all in
              one place.
            </p>
          </div>

          <p className="relative z-10 text-sm text-primary-foreground/50">
            © 2026 Talli
          </p>

          {/* Decorative shapes */}
          <div className="absolute -right-32 -top-32 size-96 rounded-full border border-primary-foreground/10" />
          <div className="absolute -bottom-40 -left-40 size-120 rounded-full border border-primary-foreground/10" />
          <div className="absolute right-20 top-1/2 size-32 rounded-full bg-primary-foreground/5 blur-3xl" />
        </section>

        {/* Login */}
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-semibold text-primary"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <WalletCards className="size-5" />
                </div>
                Talli
              </Link>
            </div>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">Welcome back</CardTitle>

                <CardDescription>
                  Log in to continue to your Talli dashboard.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>

                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="pr-10"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isSubmitting}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <Separator className="flex-1" />

                  <span className="text-xs text-muted-foreground">OR</span>

                  <Separator className="flex-1" />
                </div>

                {/* Google later */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Continue with Google
                </Button>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
