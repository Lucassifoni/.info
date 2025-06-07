import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const tags = defineCollection({
  loader: () => {
    const posts = Object.values(
      import.meta.glob("./pages/blog/*.{md,mdx}", { eager: true }),
    ) as { frontmatter: { tags: string[] } }[];

    return Object.entries(
      posts.reduce(
        (out, post) => {
          return ((post.frontmatter.tags || []) as string[]).reduce(
            (oout, tag) => {
              oout[tag] = (oout[tag] || 1) + 1;
              return oout;
            },
            out,
          );
        },
        {} as Record<string, number>,
      ),
    )
      .toSorted(([_k, v], [_k2, v2]) => (v2 < v ? -1 : 1))
      .map(([k, v]) => ({ id: k, entries: v }));
  },
  schema: z.object({
    id: z.string(),
    entries: z.number(),
  }),
});

const people = defineCollection({
  loader: async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const filePath = path.resolve('./src/people.tsv');
    const csvContent = await fs.readFile(filePath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    return lines
      .slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(';').map(v => v.trim());
        const firstName = values[0];
        const lastName = values[1];
        const description = values[2];
        const link = values[3];
        const emoji = values[4] || '';
        
        return {
          id: index.toString(),
          firstName,
          lastName,
          description,
          link,
          emoji,
        };
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  },
  schema: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    description: z.string(),
    link: z.string().url(),
    emoji: z.string(),
  }),
});

export const collections = { tags, people };
