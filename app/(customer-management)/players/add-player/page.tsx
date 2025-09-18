import SectionTitle from "@/components/section-title"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PlayerForm from "../_components/form/player-form"

async function PlayersPage({ params }: { params: Promise<{ id: string; }>}) {
  const { id } = await params;

  // TODO - pobrać te dane

  return (
    <>
      <SectionTitle
        title="Add New Player"
        backButton={
          <Button asChild variant="ghost">
            <Link href="/players">
              <ArrowLeft />
              Back to Players
            </Link>
          </Button>
        }
      />
      <PlayerForm />
    </>
  )
}

export default PlayersPage
