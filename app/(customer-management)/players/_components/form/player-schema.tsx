import { z } from "zod";

export const playerSchema = z.object({
  id: z.string().optional(),
  parentId: z.string().optional(),
  nickname: z.string()
    .min(2, "Pseudonim musi mieć co najmniej 2 znaki.")
    .max(50, "Pseudonim nie może mieć więcej niż 50 znaków."),
  fullName: z.string()
    .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki.")
    .max(50, "Imię i nazwisko nie może mieć więcej niż 50 znaków."),
  birthday: z.date(),
  // birthday: z.date({
  //   error: "Data urodzenia jest wymagana.",
  //   message: "Nieprawidłowy format daty.",
  //   // required_error: "Data urodzenia jest wymagana.",
  //   // invalid_type_error: "Nieprawidłowy format daty.",
  // }).refine((date) => date < new Date(), {
  //   message: "Data urodzenia musi być w przeszłości.",
  // }),
  // gamePreferences: z.array(z.string()).optional().default([]),
  gamePreferences: z.string().optional(),
  notes: z.string()
    .max(500, "Notatki nie mogą przekraczać 500 znaków.")
    .optional()
    .nullable(),
})
.refine(
  (data) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    const isAdult = data.birthday <= eighteenYearsAgo;

    if (!isAdult && !data.parentId) {
      return false;
    }

    return true;
  },
  {
    message: "Opiekun jest wymagany dla niepełnoletniego gracza.",
    path: ["parentId"],
  }
);

export type PlayerFormData = z.infer<typeof playerSchema>;
