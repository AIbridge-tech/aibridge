import { z } from 'zod';

// MCP Input/Output Parameters Schema
export const McpParameterSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  required: z.boolean().default(false),
  example: z.any().optional(),
  enum: z.array(z.any()).optional(),
  default: z.any().optional(),
});

export type McpParameter = z.infer<typeof McpParameterSchema>;

// MCP Function Schema
export const McpFunctionSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.array(McpParameterSchema),
  returns: z.object({
    type: z.string(),
    description: z.string(),
    example: z.any().optional(),
  }),
});

export type McpFunction = z.infer<typeof McpFunctionSchema>;

// MCP Schema
export const McpSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  functions: z.array(McpFunctionSchema),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type MCP = z.infer<typeof McpSchema>;

// MCP Rating Schema
export const McpRatingSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  value: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.string().datetime(),
});

export type McpRating = z.infer<typeof McpRatingSchema>;

// MCP with extended properties (for frontend display)
export const McpExtendedSchema = McpSchema.extend({
  id: z.string(),
  owner: z.object({
    id: z.string(),
    name: z.string(),
  }),
  ratings: z.array(McpRatingSchema).default([]),
  averageRating: z.number().default(0),
  downloads: z.number().default(0),
  isPublic: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type McpExtended = z.infer<typeof McpExtendedSchema>;

// MCP Creation Input
export const McpCreateSchema = McpSchema.omit({
  id: true,
}).extend({
  isPublic: z.boolean().default(true),
});

export type McpCreate = z.infer<typeof McpCreateSchema>;

// MCP Update Input
export const McpUpdateSchema = McpCreateSchema.partial();

export type McpUpdate = z.infer<typeof McpUpdateSchema>; 