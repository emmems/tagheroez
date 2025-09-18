'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from "@/src/api/gen/dashboard/v1/users_pb";
import { rpcProvider, useMutation } from "@/src/api/rpc.provider";
import { useState } from "react";
import ParentForm from "./parent-form";
import { ParentFormData } from "./parent-schema";

interface ParentFormDialogProps {
  parent?: User;
  children: React.ReactNode;
}

export function ParentFormDialog({ parent, children }: ParentFormDialogProps) {
  const [open, setOpen] = useState(false);

  const isEditMode = !!parent;

  const { mutateAsync: createParentMutation } = useMutation(rpcProvider.userRouter.createUser);
  const { mutateAsync: updateParentMutation } = useMutation(rpcProvider.userRouter.updateUser);

  const handleFormSubmit = async (values: ParentFormData) => {
    if (isEditMode) {
      await updateParentMutation({
        id: values.id,
        // TODO ...
        updateUser: {
          name: values.fullName,
        }
      })
    } else {
      await createParentMutation({
        name: values.fullName,
        email: values.email,
        role: 0 // UserRole.Parent
      })

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
        <ParentForm initialData={parent} onFormSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
