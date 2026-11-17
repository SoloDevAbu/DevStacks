import { db } from "@/db"
import { productComments, products, toolComments, tools, users } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"

const commentAuthor = {
  id: users.id,
  name: users.name,
  image: users.image,
  avatarUrl: users.avatarUrl,
}

// The public comments widgets only know the listing slug. Joining on it answers in one round trip
// instead of loading the whole listing first; an unknown slug simply has no comments.
export const getProductCommentsBySlug = async (slug: string) =>
  db
    .select({
      id: productComments.id,
      body: productComments.body,
      createdAt: productComments.createdAt,
      user: commentAuthor,
    })
    .from(productComments)
    .innerJoin(products, eq(productComments.productId, products.id))
    .innerJoin(users, eq(productComments.userId, users.id))
    .where(and(eq(products.slug, slug), eq(products.isDeleted, false)))
    .orderBy(desc(productComments.createdAt))

export const getToolCommentsBySlug = async (slug: string) =>
  db
    .select({
      id: toolComments.id,
      body: toolComments.body,
      createdAt: toolComments.createdAt,
      user: commentAuthor,
    })
    .from(toolComments)
    .innerJoin(tools, eq(toolComments.toolId, tools.id))
    .innerJoin(users, eq(toolComments.userId, users.id))
    .where(and(eq(tools.slug, slug), eq(tools.isDeleted, false)))
    .orderBy(desc(toolComments.createdAt))
