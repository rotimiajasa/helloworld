import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    primaryKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    type: z
      .enum(["pillar", "comparison", "how-to", "listicle", "review", "news"])
      .optional(),
    draft: z.boolean().default(false),
    needsHumanCommentary: z.boolean().default(false),
  }),
});

export const collections = { posts };
