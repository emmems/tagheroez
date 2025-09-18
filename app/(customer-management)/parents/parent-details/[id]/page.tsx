// async function CataloguePage({ params }: { params: Promise<{ locale: string; }> }) {
//     const { locale } = await params;

import SectionTitle from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function ParentDetails({ params }: { params: Promise<{ id: string; }>}) {
  const { id } = await params;

  // const {
  //   data: parentsResponse,
  //   isFetching: isParentsLoading,
  // } = useQuery(rpcProvider.userRouter.getUser);

  return (
    <>
      <SectionTitle
        title={`Parent ${id}`}
        backButton={
          <Button variant="ghost" asChild>
            <Link href="/parents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Parents
            </Link>
          </Button>
        }
      />
      <div>
        <p>Parent: {id}</p>
      </div>
    </>
  )
}

export default ParentDetails
