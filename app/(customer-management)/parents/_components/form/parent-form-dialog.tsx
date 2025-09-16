'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { rpcProvider, useMutation } from "@/src/api/rpc.provider";
import { useState } from "react";
import ParentForm from "./parent-form";
import { ParentFormData } from "./parent-schema";

interface ParentFormDialogProps {
  user?: Partial<ParentFormData>;
  children: React.ReactNode;
}

export function ParentFormDialog({ user, children }: ParentFormDialogProps) {
  const [open, setOpen] = useState(false);

  const isEditMode = !!user;

  const { mutateAsync: createParentMutation } = useMutation(rpcProvider.userRouter.createUser);
  const { mutateAsync: updateParentMutation } = useMutation(rpcProvider.userRouter.updateUser);

  const handleFormSubmit = async (values: ParentFormData) => {
    if (isEditMode) {
      await updateParentMutation({
        id: values.id,
        updateUser: {}
        // TODO ...
      })
    } else {
      const result = await createParentMutation({
        name: values.fullName,
        email: values.email,
        role: 0 // UserRole.Parent
      })

      console.log("result", result);
      console.log("Tworzenie nowego rodzica:", values);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Parent" : "Add New Parent"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Change the information below and save your changes."
              : "Create a new parent/guardian account."}
          </DialogDescription>
        </DialogHeader>
        <ParentForm initialData={user} onFormSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
