import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.any(),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).max(5).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export const notebookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  emoji: z.string().max(4).optional(),
});

export const noteSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.any(),
  notebookId: z.string(),
});

export const boardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
});
export const pinSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  linkUrl: z.string().url().optional().or(z.literal('')),
  boardId: z.string(),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens and underscores').optional(),
  bio: z.string().max(300).optional(),
  image: z.string().url().optional().or(z.literal('')),
  socialLinks: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  upiId: z.string().max(50).optional().or(z.literal('')),
});

export const tipSchema = z.object({
  amount: z.number().min(10, 'Minimum tip is ₹10').max(10000),
  toUserId: z.string(),
  articleId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type NotebookInput = z.infer<typeof notebookSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type BoardInput = z.infer<typeof boardSchema>;
export type PinInput = z.infer<typeof pinSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type TipInput = z.infer<typeof tipSchema>;