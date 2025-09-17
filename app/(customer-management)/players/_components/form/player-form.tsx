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
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { ImageUploadMock } from "./image-upload-mock";
import { PlayerFormData, playerSchema } from "./player-schema";

interface PlayerFormProps {
  initialData?: Partial<PlayerFormData>;
  onFormSubmit: (values: PlayerFormData) => Promise<void>;
}

function PlayerForm({ initialData, onFormSubmit }: PlayerFormProps) {
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  const form = useForm<PlayerFormData>({
      resolver: zodResolver(playerSchema),
      defaultValues: {
        id: initialData?.id,
        parentId: initialData?.parentId,
        nickname: initialData?.nickname ?? "",
        fullName: initialData?.fullName ?? "",
        birthday: initialData?.birthday,
        gamePreferences: initialData?.gamePreferences ?? "",
        notes: initialData?.notes ?? "",
      },
    })

  const { isSubmitting } = form.formState;

  // async function onSubmit(values: PlayerFormData) {
  //    setIsSubmitting(true);
  //    try {
  //      await onFormSubmit(values);
  //    } catch (error) {
  //      console.log("Error while creating player", error);
  //    } finally {
  //      setIsSubmitting(false);
  //    }
  // }

  async function onSubmit(values: PlayerFormData) {
    try {
      await onFormSubmit(values);
    } catch (error) {
      console.log("Error while submitting player form", error);
    }
  }

  const parents = [
      { id: 'parent-1', name: 'John Doe' },
      { id: 'parent-2', name: 'Jane Smith' },
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
                    <SelectContent>
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
                        initialFocus
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
