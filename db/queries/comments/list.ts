import { db } from "@/db"
import { comments, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export const getProductComments = async (productId: string) => {
  return db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.productId, productId))
    .orderBy(desc(comments.createdAt))
}
