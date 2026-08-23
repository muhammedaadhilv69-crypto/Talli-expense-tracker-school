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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/schemas/auth-schemas";

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: SignupFormValues) {
    const { error, data: authData } = await signUp(
      data.email,
      data.password,
      data.name,
    );

    if (error) {
      toast.error(`Signup failed: ${error.message}`);
      return;
    }

    if (!authData.session) {
      toast.success("Account created! Check your email to confirm.");
      router.push("/login");
      return;
    }

    toast.success("Account created successfully!");
    router.replace("/dashboard");
  }
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Branding */}
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="relative z-10">
            <Link
              href="/signup"
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
              Your money. Your future.
            </p>

            <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
              Learn to manage your money with confidence.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/70">
              Track spending, set budgets, build savings, and understand where
              your money goes — all in one place.
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

        {/* Right: Signup */}
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link
                href="/signup"
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
                <CardTitle className="text-2xl">Create your account</CardTitle>

                <CardDescription>
                  Start taking control of your money today.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  className="space-y-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...form.register("name")}
                      //   required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...form.register("email")}
                      //   required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className="pr-10"
                        {...form.register("password")}
                        // required
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

                  <Button type="submit" className="w-full">
                    Create account
                  </Button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <Separator className="flex-1" />
                </div>

                {/* Add Google OAuth later */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Continue with Google
                </Button>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
              By creating an account, you agree to Talli&apos;s terms and
              privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
