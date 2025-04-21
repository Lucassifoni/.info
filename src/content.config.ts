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

export const collections = { tags };
