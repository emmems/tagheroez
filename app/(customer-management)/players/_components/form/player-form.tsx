'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { User } from "@/src/api/gen/dashboard/v1/users_pb";
import { rpcProvider, useMutation } from "@/src/api/rpc.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImageUploadMock } from "./image-upload-mock";
import { PlayerFormData, playerSchema } from "./player-schema";

interface PlayerFormProps {
  initialData?: User;
  // onFormSubmit?: (values: PlayerFormData) => Promise<void>;
}

// onFormSubmit
function PlayerForm({ initialData }: PlayerFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<PlayerFormData>({
      resolver: zodResolver(playerSchema),
      defaultValues: {
        id: initialData?.id,
        parentId: "", // TODO - initialData?.parentsId
        nickname: initialData?.details?.nickname ?? "",
        fullName: initialData?.name ?? "",
        birthday: undefined, // TODO - initialData?.details?.birthday
        gamePreferences: "", // TODO - initialData?.details?.preferredActivities
        notes: initialData?.details?.notes ?? "",
      },
    })

  // const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSubmitting } = form.formState;

  const { mutateAsync: createPlayerMutation } = useMutation(rpcProvider.userRouter.createUser);
  const { mutateAsync: updatePlayerMutation } = useMutation(rpcProvider.userRouter.updateUser);

  const handleFormSubmit = async (values: PlayerFormData) => {
    if (isEditMode) {
      await updatePlayerMutation({
        id: values.id,
        // TODO ...
        updateUser: {
          name: values.fullName,
          details: {
            nickname: values.nickname,
            notes: values.notes ?? undefined
          }
        }
      })
    } else {
      await createPlayerMutation({
        name: values.fullName,
        // TODO - details update :()
        role: 1 // UserRole.Player
      })
    }

    router.push('/players');
  };

  async function onSubmit(values: PlayerFormData) {
    //    setIsSubmitting(true);
    try {
      await handleFormSubmit(values);

      toast.success(isEditMode ? "The changes have been saved." : "New player created.")
    } catch (error) {
      console.log("Error while submitting player form", error);
      toast.error("Something gone wrong.")
    }
    //    } finally {
    //      setIsSubmitting(false);
    //    }
  }

  const parents = [
      { id: 'parent-1', name: 'John Doe' },
      { id: 'parent-2', name: 'Jane Smith' },
      { id: 'parent-3', name: 'Jane Smith' },
      { id: 'parent-4', name: 'Jane Smith' },
      { id: 'parent-5', name: 'Jane Smith' },
      { id: 'parent-6', name: 'Jane Smith' },
      { id: 'parent-7', name: 'Jane Smith' },
      { id: 'parent-8', name: 'Jane Smith' },
      { id: 'parent-9', name: 'Jane Smith' },
      { id: 'parent-10', name: 'Jane Smith' },
      { id: 'parent-11', name: 'Jane Smith' },
      { id: 'parent-12', name: 'Jane Smith' },
      { id: 'parent-122', name: 'Jane Smith' },
      { id: 'parent-13', name: 'Jane Smith' },
      { id: 'parent-14', name: 'Jane Smith' },
      { id: 'parent-15', name: 'Jane Smith' },
      { id: 'parent-16', name: 'Jane Smith' },
      { id: 'parent-17', name: 'Jane Smith' },
      { id: 'parent-18', name: 'Jane Smith' },
      { id: 'parent-19', name: 'Jane Smith' },
      { id: 'parent-20', name: 'Jane Smith' },
      { id: 'parent-21', name: 'Jane Smith' },
    ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Player Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-6 gap-6">
        <div className="col-span-2">
          <ImageUploadMock />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 col-span-4">
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent/guardian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[250px]">
                      {parents.map(parent => (
                        <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The parent or guardian responsible for this player.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input placeholder="Ninja" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name used during gameplay.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Admin" {...field} />
                  </FormControl>
                  <FormDescription>
                    Player's legal name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Birthday</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TODO */}
            <FormField
              control={form.control}
              name="gamePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Preferences</FormLabel>
                  <FormControl>
                    <Input placeholder="Obstacle Course, Capture the Flag, Parkour" {...field} />
                  </FormControl>
                   <FormDescription>Comma-separated list of preferred activities.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special instructions, medical information, or preferences"
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                   ? (isEditMode ? "Saving..." : "Creating...")
                   : (isEditMode ? "Save changes" : "Save Player")
                 }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default PlayerForm;
