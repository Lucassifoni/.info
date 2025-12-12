import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../../../../config";

export async function getStaticPaths() {
  const tags = await getCollection("tags");
  return tags.map((t) => ({
    params: { id: t.id },
  }));
}

export async function GET(context) {
  const tagId = context.params.id;

  const posts = await Promise.all(
    Object.entries(import.meta.glob("./../../*.{md,mdx}", { eager: true }))
      .filter(([_, post]) => (post.frontmatter?.tags || []).includes(tagId))
      .map(async ([path, post]) => {
        return {
          link: path.replace(/^\.\/\.\.\/\.\.\/(.*)\.mdx?$/, "/blog/$1"),
          title: post.frontmatter?.title,
          pubDate: post.frontmatter?.pubDate,
          description: post.frontmatter?.description,
          customData: post.frontmatter?.tags
            ? `<category>${post.frontmatter.tags.join("</category><category>")}</category>`
            : "",
        };
      })
  );

  return rss({
    title: `${SITE_TITLE} - ${tagId}`,
    description: `Articles about ${tagId} - ${SITE_DESCRIPTION}`,
    site: context.site,
    items: posts,
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}
