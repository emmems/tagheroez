import SectionTitle from "@/components/section-title"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PlayerForm from "../_components/form/player-form"

function PlayersPage() {
  return (
    <>
      <SectionTitle
        title="Add New Player"
        backButton={
          <Button variant="ghost">
            <ArrowLeft />
            Back to Players
          </Button>
        }
      />
      <PlayerForm />
    </>
  )
}

export default PlayersPage
