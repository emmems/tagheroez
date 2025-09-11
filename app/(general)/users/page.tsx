import SectionTitle from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { InviteUserDialog } from "./_components/invite-user-dialog";
import InternalUsers from "./_components/sections/internal-users";

function UserManagementPage() {

  return (
    <>
      <SectionTitle
        title="User Management"
        subtitle="Manage internal users and their access rights"
        button={
          <InviteUserDialog>
            <Button>Invite User</Button>
          </InviteUserDialog>
        }
      />
      <InternalUsers />
    </>
  )
}

export default UserManagementPage
