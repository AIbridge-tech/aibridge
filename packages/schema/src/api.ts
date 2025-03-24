import { z } from 'zod';

// API Success Response Schema
export const ApiResponseSchema = z.object({
  data: z.any(),
  message: z.string().optional(),
});

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

// API Error Response Schema
export const ApiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.any().optional(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Pagination Schema
export const PaginationParamsSchema = z.object({
  page: z.number().int().default(1),
  limit: z.number().int().default(10),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// Pagination Response Schema
export const PaginationResponseSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});

export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;

// Paginated Response Schema
export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: PaginationResponseSchema,
});

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationResponse;
}; 