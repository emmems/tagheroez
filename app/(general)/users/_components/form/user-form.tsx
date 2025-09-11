'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Employee } from "@/src/api/gen/dashboard/v1/users_pb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserFormData, userSchema } from "./user-schema";


interface UserFormProps {
  initialData: Employee;
  onFormSubmit: (values: UserFormData) => Promise<void>;
}

function UserForm({ initialData, onFormSubmit }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormData>({
      resolver: zodResolver(userSchema),
      defaultValues: {
        id: initialData?.id || undefined,
        fullName: "",
        username: "",
        email: initialData?.email || "",
        password: "",
        confirmPassword: "",
        role: initialData?.role ? initialData.role === 1 ? "superadmin" : "admin" : "admin",
      },
    })

  async function onSubmit(values: UserFormData) {
     setIsSubmitting(true);
     try {
       await onFormSubmit(values);
     } catch (error) {
       console.log("Error while creating user", error);
     } finally {
       setIsSubmitting(false);
     }
   }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Admin" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johnadmin" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@jumpheroez.com" {...field} />
              </FormControl>
              <FormDescription>
                A verification email will be sent to this address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 8 characters, including uppercase and lowercase letters and numbers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please re-enter your password to avoid any mistakes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-ful">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {/* <FormDescription>?</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UserForm;
