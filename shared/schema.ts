import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  state: string;
  sector: string;
  gender: string;
  url: string;
}

export interface UserInfo {
  age: number;
  gender: string;
  state: string;
  sector: string;
  description?: string;
}

export interface AIExplanation {
  explanation: string;
  requiredDocuments: string[];
  nextSteps: string;
}
