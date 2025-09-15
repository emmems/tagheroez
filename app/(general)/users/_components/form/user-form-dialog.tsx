"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Employee } from "@/src/api/gen/dashboard/v1/users_pb";
import { rpcProvider, useMutation } from "@/src/api/rpc.provider";
import { useState } from "react";
import UserForm from "./user-form";
import { UserFormData } from "./user-schema";

interface UserFormDialogProps {
  user: Employee;
  children: React.ReactNode;
}

export function UserFormDialog({ user, children }: UserFormDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: updateEmployeeMutation } = useMutation(
    rpcProvider.userRouter.updateEmployee,
  );

  const handleFormSubmit = async (values: UserFormData) => {
    await updateEmployeeMutation({
      id: values.id,
      email: values.email,
      role: values.role === "superadmin" ? 1 : 0,
      // TODO ...
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Change the information below and save your changes.
          </DialogDescription>
        </DialogHeader>
        <UserForm initialData={user} onFormSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
}
