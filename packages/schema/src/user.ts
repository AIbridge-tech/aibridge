import { z } from 'zod';

// User Role Schema
export const UserRoleSchema = z.enum(['user', 'developer', 'admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

// User Stats Schema
export const UserStatsSchema = z.object({
  mcpsCreated: z.number().default(0),
  totalDownloads: z.number().default(0),
  averageRating: z.number().default(0),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema.default('user'),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  stats: UserStatsSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// User Creation Input
export const UserCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: UserRoleSchema.optional(),
});

export type UserCreate = z.infer<typeof UserCreateSchema>;

// User Update Input
export const UserUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  role: UserRoleSchema.optional(),
}).strict();

export type UserUpdate = z.infer<typeof UserUpdateSchema>;

// Login Credentials
export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

// Authentication Response
export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>; 