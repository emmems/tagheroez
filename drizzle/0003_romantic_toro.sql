ALTER TABLE "site_users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."site_user_role";--> statement-breakpoint
CREATE TYPE "public"."site_user_role" AS ENUM('parent', 'player');--> statement-breakpoint
ALTER TABLE "site_users" ALTER COLUMN "role" SET DATA TYPE "public"."site_user_role" USING "role"::"public"."site_user_role";