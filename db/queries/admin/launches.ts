import { db } from "@/db"
import { launches, products, tools, users } from "@/db/schema"
import { and, asc, eq } from "drizzle-orm"

export const getAdminLaunchWeek = async (isoYear: number, isoWeek: number) => {
  const rows = await db
    .select({
      id: launches.id,
      itemType: launches.itemType,
      tier: launches.tier,
      status: launches.status,
      launchStatus: launches.launchStatus,
      toolId: launches.toolId,
      productId: launches.productId,
      toolName: tools.name,
      productName: products.name,
      submitterEmail: users.email,
      createdAt: launches.createdAt,
    })
    .from(launches)
    .innerJoin(users, eq(launches.submitterId, users.id))
    .leftJoin(tools, eq(launches.toolId, tools.id))
    .leftJoin(products, eq(launches.productId, products.id))
    .where(and(eq(launches.isoYear, isoYear), eq(launches.isoWeek, isoWeek)))
    .orderBy(asc(launches.tier), asc(launches.createdAt))

  return rows.map(({ toolName, productName, toolId, productId, ...row }) => ({
    ...row,
    itemId: (toolId ?? productId) as string,
    name: toolName ?? productName ?? "",
  }))
}

export type AdminLaunchRow = Awaited<
  ReturnType<typeof getAdminLaunchWeek>
>[number]
