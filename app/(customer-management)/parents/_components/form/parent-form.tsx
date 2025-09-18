'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/src/api/gen/dashboard/v1/users_pb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ParentFormData, parentSchema } from "./parent-schema";


interface ParentFormProps {
  initialData?: User;
  onFormSubmit: (values: ParentFormData) => Promise<void>;
}

function ParentForm({ initialData, onFormSubmit }: ParentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  const form = useForm<ParentFormData>({
      resolver: zodResolver(parentSchema),
      defaultValues: {
        id: initialData?.id || undefined,
        fullName: initialData?.name || "",
        email: initialData?.email || "",
        phoneNumber: "", // TODO
        termsAndConditions: false, // TODO
        marketingCommunications: false, // TODO
      },
    })

  async function onSubmit(values: ParentFormData) {
     setIsSubmitting(true);
     try {
       await onFormSubmit(values);

       toast.success(isEditMode ? "The changes have been saved." : "New parent created.")
     } catch (error) {
       console.log("Error while creating/saving parent", error);
       toast.error("Something gone wrong.")
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormDescription>
                A verification email will be sent to this address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isEditMode}
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+48 123 123 123" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isEditMode}
          control={form.control}
          name="termsAndConditions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={field.disabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Terms and Conditions
                </FormLabel>
                <FormDescription>
                  Parent has agreed to terms and conditions
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketingCommunications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Marketing Communications
                </FormLabel>
                <FormDescription>
                  Parent agrees to receive marketing communications
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
               ? (isEditMode ? "Saving..." : "Creating...")
               : (isEditMode ? "Save changes" : "Create Parent Account")
             }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ParentForm;
