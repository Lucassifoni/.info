import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import fs from "fs/promises";
import path from "path";

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
    const filePath = path.resolve("./src/people.tsv");
    const csvContent = await fs.readFile(filePath, "utf-8");
    const lines = csvContent.trim().split("\n");

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line, index) => {
        const values = line.split(";").map((v) => v.trim());
        const firstName = values[0];
        const lastName = values[1];
        const description = values[2];
        const link = values[3];
        const emoji = values[4] || "";

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

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MODEL_EXTS = new Set([".stl", ".step", ".pdf"]);

const models = defineCollection({
  loader: async () => {
    const md = await createMarkdownProcessor();
    const modelsDir = path.resolve("./public/models");
    let entries: string[];
    try {
      entries = await fs.readdir(modelsDir);
    } catch {
      return [];
    }

    const results = [];
    for (const slug of entries) {
      const dir = path.join(modelsDir, slug);
      const stat = await fs.stat(dir);
      if (!stat.isDirectory()) continue;

      let info: { name: string; description: string; printables?: string };
      try {
        info = JSON.parse(
          await fs.readFile(path.join(dir, "info.json"), "utf-8"),
        );
      } catch {
        continue;
      }

      const dirEntries = await fs.readdir(dir);

      const files = [];
      const images: string[] = [];
      let thumb: string | null = null;

      for (const entry of dirEntries) {
        const ext = path.extname(entry).toLowerCase();
        const base = path.basename(entry, ext).toLowerCase();

        if (MODEL_EXTS.has(ext)) {
          const fileStat = await fs.stat(path.join(dir, entry));
          files.push({ name: entry, size: fileStat.size, ext: ext.slice(1) });
        }

        if (IMAGE_EXTS.has(ext)) {
          images.push(entry);
          if (base === "thumb") {
            thumb = entry;
          }
        }
      }

      let descriptionHtml = "";
      try {
        const raw = await fs.readFile(path.join(dir, "description.md"), "utf-8");
        const { code } = await md.render(raw);
        descriptionHtml = code;
      } catch {
      }

      results.push({
        id: slug,
        name: info.name,
        description: descriptionHtml || info.description,
        printables: info.printables || "",
        files,
        images,
        thumb,
      });
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    printables: z.string(),
    files: z.array(
      z.object({
        name: z.string(),
        size: z.number(),
        ext: z.string(),
      }),
    ),
    images: z.array(z.string()),
    thumb: z.string().nullable(),
  }),
});

export const collections = { tags, people, models };
