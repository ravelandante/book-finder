import { z } from 'zod';

const AuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const RatingSchema = z.object({
  average: z.number(),
});

const BookSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().optional(),
  image: z.string(),
  authors: z.array(AuthorSchema),
  rating: RatingSchema,
});

export const BookListResponseSchema = z.object({
  available: z.number(),
  number: z.number(),
  offset: z.number(),
  books: z.array(z.array(BookSchema)),
});

export type BookListResponse = z.infer<typeof BookListResponseSchema>;
