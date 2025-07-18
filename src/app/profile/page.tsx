"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSession } from "@/context/session-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RotateCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

const profileFormSchema = z.object({
  first_name: z.string().max(50).optional().or(z.literal('')),
  last_name: z.string().max(50).optional().or(z.literal('')),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { session, user, isLoading: isSessionLoading } = useSession();
  const router = useRouter();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/login");
    }
  }, [session, isSessionLoading, router]);

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email || "");
      supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') { // Ignore error for no rows found
            console.error("Error fetching profile", error);
            toast.error("Could not load your profile.");
          }
          if (data) {
            form.reset({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              email: user.email || "",
            });
          }
        });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setIsFormLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
      })
      .eq("id", user.id);

    setIsFormLoading(false);

    if (error) {
      toast.error("Failed to update profile. Please try again.");
    } else {
      toast.success("Profile updated successfully!");
    }
  }

  if (isSessionLoading || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RotateCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
             <Link href="/" passHref>
              <Button variant="outline" size="icon" aria-label="Go back to chat">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isFormLoading}>
                {isFormLoading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}