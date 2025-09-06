CREATE TYPE "public"."employee_role" AS ENUM('admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."site_user_role" AS ENUM('parent', 'child');--> statement-breakpoint
CREATE TABLE "employees" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "employees_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"role" "employee_role" NOT NULL,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"last_login_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parent_child_relationship" (
	"parent_id" integer NOT NULL,
	"child_id" integer NOT NULL,
	CONSTRAINT "parent_child_relationship_parent_id_child_id_pk" PRIMARY KEY("parent_id","child_id")
);
--> statement-breakpoint
CREATE TABLE "site_users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "site_users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"role" "site_user_role" NOT NULL,
	"email" varchar(255),
	"last_login_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "parent_child_relationship" ADD CONSTRAINT "parent_child_relationship_parent_id_site_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parent_child_relationship" ADD CONSTRAINT "parent_child_relationship_child_id_site_users_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."site_users"("id") ON DELETE no action ON UPDATE no action;