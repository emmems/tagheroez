'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const newUserSchema = z.object({
  email: z.email(),
})

type NewUserFormData = z.infer<typeof newUserSchema>;

interface InviteUserDialogProps {
  children: React.ReactNode;
}

export function InviteUserDialog({ children }: InviteUserDialogProps) {
  const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewUserFormData>({
      resolver: zodResolver(newUserSchema),
      defaultValues: {
        email: "",
      },
    })

  async function onSubmit(values: NewUserFormData) {
     setIsSubmitting(true);
     try {
       // await onFormSubmit(values);
       // setOpen(false);
     } catch (error) {
       console.log("Error while sending invite", error);
     } finally {
       setIsSubmitting(false);
     }
   }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
