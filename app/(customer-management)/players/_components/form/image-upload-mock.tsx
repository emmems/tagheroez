import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UploadCloud, User as UserIcon } from "lucide-react"

export function ImageUploadMock() {
  return (
    <>
       {/* gap-12 md:grid-cols-2 */}
      <div className="grid gap-4">
        <div className="flex justify-center">
          <Avatar className="h-32 w-32 border-2 border-dashed">
            <AvatarFallback className="bg-transparent">
              <UserIcon className="h-16 w-16 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
          <UploadCloud className="h-12 w-12" />
          <p className="font-semibold">Drag and drop or click to upload</p>
          <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
          <Button type="button" variant="outline" className="mt-2">
            Select File
          </Button>
        </div>
      </div>

      {/* <div className="grid gap-4">
        <div className="flex justify-center">
          <Avatar className="h-32 w-32 border-2 border-dashed">
            <AvatarImage src="https://picsum.photos/200" alt="Avatar preview" />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
          <UploadCloud className="h-12 w-12" />
          <p className="font-semibold">Drag and drop or click to upload</p>
          <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
          <div className="mt-2 flex items-center gap-2">
            <Button type="button" variant="outline">
              Select File
            </Button>
            <Button type="button" variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div> */}
    </>
  )
}
