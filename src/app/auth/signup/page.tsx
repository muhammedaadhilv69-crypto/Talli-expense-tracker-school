"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/schemas/auth-schema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Signup() {
    const router = useRouter()
  const { signUp } = useAuth();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(data: SignupFormValues) {
    const { data: authData, error } = await signUp(
      data.email,
      data.password,
      data.name,
    );

    if (error) {
      toast.error(`Signup Failed: ${error.message}`);
      return;
    }
    if (!authData.session) {
      toast.success(
        "Account created! Check your email to confirm your account.",
      );
      return;
    }

    toast.success("Signup successful");
    router.replace("/dashboard");
  }
  return (
    <div className="flex flex-col p-2 gap-4 items-center justify-center min-h-screen w-full">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-4xl text-primary">Talli</h1>
        <p className="text-sm text-muted-foreground">
          Where students learn to manage money
        </p>
      </div>
      <div className="w-96 h-fit p-6 font-sans">
        <Card>
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="text-2xl">Signup to Talli</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Start tracking in just a few minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-2 flex flex-col gap-2"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...form.register("name")}
                  />
                  <FieldError errors={[form.formState.errors.name]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    {...form.register("email")}
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters long."
                    {...form.register("password")}
                  />
                  <FieldError errors={[form.formState.errors.password]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm password
                  </FieldLabel>
                  <Input
                    type="password"
                    id="confirm-password"
                    {...form.register("confirmPassword")}
                    placeholder="Confirm your password"
                  />
                  <FieldError
                    errors={[form.formState.errors.confirmPassword]}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Creating account" : "Sign Up"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Signup;
