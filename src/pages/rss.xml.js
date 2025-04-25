import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";

export async function GET(context) {
  const posts = await Promise.all(
    Object.entries(import.meta.glob("./blog/**/*.{md,mdx}", { eager: true }))
      .map(async ([path, post]) => {
        return {
          link: path.replace(/^\.\/blog\/(.*)\.mdx?$/, "/blog/$1"),
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts,
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}
