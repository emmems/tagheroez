import SectionTitle from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { ParentFormDialog } from "./_components/form/parent-form-dialog";
import ParentsSection from "./_components/sections/parents/parents-section";

function ParentsPage() {
  return (
    <>
      <SectionTitle
        title="Parent Management"
        subtitle="Manage parent/guardian accounts"
        button={
          <ParentFormDialog>
            <Button>Add New Parent</Button>
          </ParentFormDialog>
        }
      />
      <ParentsSection />
    </>
  )
}

export default ParentsPage
