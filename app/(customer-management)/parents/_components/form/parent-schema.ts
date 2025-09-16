import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

// export const parentSchema = z.object({
//   id: z.string().optional(),
//   fullName: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki."),
//   email: z.string().email("Nieprawidłowy adres email."),
//   phoneNumber: z.string().regex(phoneRegex, 'Nieprawidłowy format numeru telefonu.'),
// });

export const parentSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2).max(50),
  email: z.email(),
  phoneNumber: z.string().regex(phoneRegex, 'Nieprawidłowy format numeru telefonu.'),
  termsAndConditions: z.boolean().refine(
    (value) => value === true,
    "Musisz zaakceptować regulamin."
  ),
  marketingCommunications: z.boolean().optional(),
})

export type ParentFormData = z.infer<typeof parentSchema>;
