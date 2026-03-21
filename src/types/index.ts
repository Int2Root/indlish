import { User, Article, Notebook, Note, Board, Pin, Tip, Tag } from '@prisma/client';

export type SafeUser = Omit<User, 'password' | 'emailVerified'> & {
  _count?: { articles: number; followers: number; following: number };
};

export type ArticleWithAuthor = Article & {
  author: SafeUser;
  tags: { tag: Tag }[];
  _count: { likes: number; tips: number };
};

export type BoardWithPins = Board & {
  user: SafeUser;
  pins: Pin[];
  _count: { pins: number; followers: number };
};

export type NotebookWithNotes = Notebook & {
  notes: Note[];
  _count: { notes: number };
};

export type FeedItem = {
  type: 'article' | 'board';
  id: string;
  createdAt: Date;
  article?: ArticleWithAuthor;
  board?: BoardWithPins;
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      username?: string | null;
      plan: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    username?: string | null;
    plan: string;
  }
}