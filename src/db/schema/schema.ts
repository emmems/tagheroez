import {
  foreignKey,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Define enums
export const employeeRoleEnum = pgEnum("employee_role", [
  "admin",
  "super_admin",
]);
export type EmployeeRole = (typeof employeeRoleEnum.enumValues)[number];

export const employeeStatus = pgEnum("employee_status", ["active", "inactive"]);
export const siteUserRoleEnum = pgEnum("site_user_role", ["parent", "player"]);

export const employeesTable = pgTable("employees", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  externalUserID: varchar("external_user_id", { length: 255 })
    .notNull()
    .unique(),
  name: varchar({ length: 255 }).notNull(),
  role: employeeRoleEnum().notNull(),
  status: employeeStatus().default("active").notNull(),
  lastLoginAt: timestamp("last_login_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteUsersTable = pgTable("site_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: siteUserRoleEnum().notNull(),
  email: varchar({ length: 255 }).unique(),

  details: jsonb("details"),

  lastLoginAt: timestamp("last_login_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parentChildRelationshipTable = pgTable(
  "parent_child_relationship",
  {
    parentId: integer("parent_id").notNull(),
    childId: integer("child_id").notNull(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.parentId, table.childId] }),
      foreignKey({
        columns: [table.parentId],
        foreignColumns: [siteUsersTable.id],
      }),
      foreignKey({
        columns: [table.childId],
        foreignColumns: [siteUsersTable.id],
      }),
    ];
  },
);
