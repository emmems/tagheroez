import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { User } from "@/src/api/gen/dashboard/v1/users_pb";
import { rpcProvider, useMutation } from "@/src/api/rpc.provider";
import { EllipsisVertical, Pencil, View } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { ParentFormDialog } from "./form/parent-form-dialog";

interface ParentActionsCellProps {
  parent: User;
  updateUser?: Dispatch<SetStateAction<User[] | undefined>>;
}

function ParentActionsCell({ parent, updateUser }: ParentActionsCellProps) {
  const {
    mutateAsync: updateParent,
    isPending: isUpdatingEmployee
  } = useMutation(rpcProvider.userRouter.updateUser)

  // async function handleToggleActivation() {
  //   const newStatus = parent.status === 0 ? 1 : 0; // 'Inactive' : 'Active'

  //   let originalUsers: Employee[] | undefined;

  //   updateUser((currentUsers) => {
  //     originalUsers = currentUsers;

  //     if (!currentUsers) return [];

  //     return currentUsers.map((currentUser) => {
  //       if (currentUser.id === user.id) {
  //         return { ...currentUser, status: newStatus };
  //       }
  //       return currentUser;
  //     });
  //   });

  //   try {
  //     await updateParent({ id: user.id, status: newStatus });

  //     toast.success("The changes have been saved.")
  //   } catch (error) {
  //     console.error("Nie udało się zaktualizować użytkownika, przywracam stan.", error);

  //     updateUser(originalUsers);

  //     toast.error("Something gone wrong.", {
  //       description: "The changes could not be saved.",
  //     })
  //   }
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/parents/parent-details/${parent.id}`}>
            <View className="mr-2 h-4 w-4" />
            <span>View</span>
          </Link>
        </DropdownMenuItem>

        <ParentFormDialog parent={parent}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </ParentFormDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ParentActionsCell;
