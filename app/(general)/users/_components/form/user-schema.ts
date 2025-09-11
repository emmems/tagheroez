import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2).max(50),
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_.]+$/),
  email: z.email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
  confirmPassword: z.string(),
  role: z.enum(["superadmin", "admin"]),
}).refine(data => data.password === data.confirmPassword, {
  message: "Hasła muszą być takie same.",
  path: ["confirmPassword"],
});

export type UserFormData = z.infer<typeof userSchema>;

// const formSchema = z.object({
//   fullName: z.string()
//     .min(2, { message: "Imię i nazwisko musi mieć co najmniej 2 znaki." }),

//   username: z.string()
//     .min(2, { message: "Nazwa użytkownika musi mieć co najmniej 2 znaki." })
//     .regex(/^[a-zA-Z0-9_.]+$/, { message: "Nazwa użytkownika zawiera niedozwolone znaki." }),

//   email: z.string()
//     .min(1, { message: "Adres e-mail jest wymagany." })
//     .email({ message: "Proszę podać poprawny adres e-mail." }),

//   password: z.string()
//     .min(8, { message: "Hasło musi mieć co najmniej 8 znaków." })
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
//       message: "Hasło musi zawierać małą i wielką literę oraz cyfrę."
//     }),

//   role: z.enum(["superadmin", "admin"], {
//     required_error: "Musisz wybrać rolę.",
//   }),
// });
