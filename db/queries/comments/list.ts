import { db } from "@/db"
import { toolComments, productComments, users } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export const getToolComments = async (toolId: string) => {
  return db
    .select({
      id: toolComments.id,
      body: toolComments.body,
      createdAt: toolComments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(toolComments)
    .innerJoin(users, eq(toolComments.userId, users.id))
    .where(eq(toolComments.toolId, toolId))
    .orderBy(desc(toolComments.createdAt))
}

export const getProductComments = async (productId: string) => {
  return db
    .select({
      id: productComments.id,
      body: productComments.body,
      createdAt: productComments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(productComments)
    .innerJoin(users, eq(productComments.userId, users.id))
    .where(eq(productComments.productId, productId))
    .orderBy(desc(productComments.createdAt))
}
