import SectionTitle from "@/components/section-title"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PlayersSection from "./_components/sections/players-section"

function PlayersPage() {
  return (
    <>
      <SectionTitle
        title="Player Management"
        subtitle="Manage player profiles and game history"
        button={<Button>
          <Link href="players/add-player">
            Add New Player
          </Link>
        </Button>}
      />
      <PlayersSection />
    </>
  )
}

export default PlayersPage
