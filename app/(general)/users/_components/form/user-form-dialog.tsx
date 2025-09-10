'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import UserForm from "./user-form";
import { UserFormData } from "./user-schema";

interface UserFormDialogProps {
  user?: Partial<UserFormData>;
  children: React.ReactNode;
}

export function UserFormDialog({ user, children }: UserFormDialogProps) {
  const [open, setOpen] = useState(false);

  const isEditMode = !!user;

  const handleFormSubmit = async (values: UserFormData) => {
    if (isEditMode) {
      console.log("Aktualizowanie użytkownika:", user.id, values);
    } else {
      console.log("Tworzenie nowego użytkownika:", values);
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
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Zmień dane poniżej i zapisz zmiany." : "Create a new internal user account with appropriate role."}
          </DialogDescription>
        </DialogHeader>
        <UserForm initialData={user} onFormSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
