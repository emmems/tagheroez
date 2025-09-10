'use client'

import SectionTitle from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { rpcProvider, useQuery } from "@/src/api/rpc.provider";
import { UserFormDialog } from "./_components/form/user-form-dialog";
import InternalUsers from "./_components/sections/internal-users";

function UserManagementPage() {
  const { data: users } = useQuery(rpcProvider.userRouter.getUsers);
    const { data: employees } = useQuery(rpcProvider.userRouter.getEmployees);

    console.log("users: ", users);
    console.log("employees", employees);


  return (
    <>
      <SectionTitle
        title="User Management"
        subtitle="Manage internal users and their access rights"
        button={
          <UserFormDialog>
            <Button>Add New User</Button>
          </UserFormDialog>

        }
      />
      <InternalUsers />
    </>
  )
}

export default UserManagementPage
