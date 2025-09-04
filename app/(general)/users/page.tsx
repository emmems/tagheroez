import SectionTitle from "@/components/section-title"
import { Button } from "@/components/ui/button"
import InternalUsers from "./_components/sections/internal-users"

function UserManagementPage() {
  return (
    <>
      <SectionTitle
        title="User Management"
        subtitle="Manage internal users and their access rights"
        button={
          <Button size="lg">
            Add New User
          </Button>
        }
      />
      <InternalUsers />
    </>
  )
}

export default UserManagementPage
