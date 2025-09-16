import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Employee } from "@/src/api/gen/dashboard/v1/users_pb";
import { rpcProvider, useMutation } from "@/src/api/rpc.provider";
import { EllipsisVertical, Pencil, Power } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
// import { UserFormDialog } from "./form/user-form-dialog";

interface ParentActionsCellProps {
  user: Employee;
  updateUser: Dispatch<SetStateAction<Employee[] | undefined>>;
}

function ParentActionsCell({ user, updateUser }: ParentActionsCellProps) {
  const {
    mutateAsync: updateEmployee,
    isPending: isUpdatingEmployee
  } = useMutation(rpcProvider.userRouter.updateEmployee)

  async function handleToggleActivation() {
    const newStatus = user.status === 0 ? 1 : 0; // 'Inactive' : 'Active'

    let originalUsers: Employee[] | undefined;

    updateUser((currentUsers) => {
      originalUsers = currentUsers;

      if (!currentUsers) return [];

      return currentUsers.map((currentUser) => {
        if (currentUser.id === user.id) {
          return { ...currentUser, status: newStatus };
        }
        return currentUser;
      });
    });

    try {
      await updateEmployee({ id: user.id, status: newStatus });

      toast.success("The changes have been saved.")
    } catch (error) {
      console.error("Nie udało się zaktualizować użytkownika, przywracam stan.", error);

      updateUser(originalUsers);

      toast.error("Something gone wrong.", {
        description: "The changes could not be saved.",
      })
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <UserFormDialog user={user}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </UserFormDialog>

        <DropdownMenuItem onClick={handleToggleActivation}>
          <Power className="mr-2 h-4 w-4" />
          <span>{user.status === 0 ? 'Deactivate' : 'Active'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ParentActionsCell;
