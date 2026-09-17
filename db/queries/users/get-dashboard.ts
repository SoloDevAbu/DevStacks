import { db } from "@/db"
import {
  tools,
  products,
  toolComments,
  productComments,
  categories,
  users,
} from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import type {
  UserDashboardData,
  DbTool,
  DbProduct,
  UserDashboardComment,
} from "@/types/entities"

export const getUserDashboardData = async (
  userId: string
): Promise<UserDashboardData> => {
  const [userTools, userProducts, recentToolComments, recentProductComments] =
    await Promise.all([
      db
        .select({
          id: tools.id,
          slug: tools.slug,
          name: tools.name,
          tagline: tools.tagline,
          description: tools.description,
          problemStatement: tools.problemStatement,
          solution: tools.solution,
          uniqueValue: tools.uniqueValue,
          tags: tools.tags,
          platforms: tools.platforms,
          upvotesCount: tools.upvotesCount,
          buildsCount: tools.buildsCount,
          commentsCount: tools.commentsCount,
          viewsCount: tools.viewsCount,
          pricing: tools.pricing,
          tier: tools.tier,
          status: tools.status,
          logoUrl: tools.logoUrl,
          websiteUrl: tools.websiteUrl,
          githubUrl: tools.githubUrl,
          twitterUrl: tools.twitterUrl,
          linkedinUrl: tools.linkedinUrl,
          discordUrl: tools.discordUrl,
          appStoreUrl: tools.appStoreUrl,
          playStoreUrl: tools.playStoreUrl,
          chromeExtensionUrl: tools.chromeExtensionUrl,
          images: tools.images,
          demoVideoUrl: tools.demoVideoUrl,
          useCases: tools.useCases,
          categoryId: tools.categoryId,
          category: categories.name,
          categorySlug: categories.slug,
          submitterId: tools.submitterId,
          createdAt: tools.createdAt,
          updatedAt: tools.updatedAt,
        })
        .from(tools)
        .leftJoin(categories, eq(tools.categoryId, categories.id))
        .where(eq(tools.submitterId, userId))
        .orderBy(desc(tools.createdAt)),

      db
        .select({
          id: products.id,
          slug: products.slug,
          name: products.name,
          tagline: products.tagline,
          description: products.description,
          problemStatement: products.problemStatement,
          solution: products.solution,
          uniqueValue: products.uniqueValue,
          tags: products.tags,
          platforms: products.platforms,
          likesCount: products.likesCount,
          commentsCount: products.commentsCount,
          viewsCount: products.viewsCount,
          pricing: products.pricing,
          tier: products.tier,
          status: products.status,
          logoUrl: products.logoUrl,
          websiteUrl: products.websiteUrl,
          githubUrl: products.githubUrl,
          twitterUrl: products.twitterUrl,
          linkedinUrl: products.linkedinUrl,
          discordUrl: products.discordUrl,
          appStoreUrl: products.appStoreUrl,
          playStoreUrl: products.playStoreUrl,
          chromeExtensionUrl: products.chromeExtensionUrl,
          images: products.images,
          demoVideoUrl: products.demoVideoUrl,
          useCases: products.useCases,
          categoryId: products.categoryId,
          category: categories.name,
          categorySlug: categories.slug,
          submitterId: products.submitterId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.submitterId, userId))
        .orderBy(desc(products.createdAt)),

      db
        .select({
          id: toolComments.id,
          body: toolComments.body,
          createdAt: toolComments.createdAt,
          toolId: toolComments.toolId,
          toolName: tools.name,
          toolSlug: tools.slug,
          authorName: users.name,
          authorImage: users.image,
          authorUsername: users.username,
        })
        .from(toolComments)
        .innerJoin(tools, eq(toolComments.toolId, tools.id))
        .innerJoin(users, eq(toolComments.userId, users.id))
        .where(eq(tools.submitterId, userId))
        .orderBy(desc(toolComments.createdAt))
        .limit(20),

      db
        .select({
          id: productComments.id,
          body: productComments.body,
          createdAt: productComments.createdAt,
          productId: productComments.productId,
          productName: products.name,
          productSlug: products.slug,
          authorName: users.name,
          authorImage: users.image,
          authorUsername: users.username,
        })
        .from(productComments)
        .innerJoin(products, eq(productComments.productId, products.id))
        .innerJoin(users, eq(productComments.userId, users.id))
        .where(eq(products.submitterId, userId))
        .orderBy(desc(productComments.createdAt))
        .limit(20),
    ])

  const unifiedComments: UserDashboardComment[] = [
    ...recentToolComments.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      targetKind: "tool" as const,
      targetName: c.toolName,
      targetSlug: c.toolSlug,
      authorName: c.authorName,
      authorUsername: c.authorUsername,
      authorImage: c.authorImage,
    })),
    ...recentProductComments.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      targetKind: "product" as const,
      targetName: c.productName,
      targetSlug: c.productSlug,
      authorName: c.authorName,
      authorUsername: c.authorUsername,
      authorImage: c.authorImage,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalToolUpvotes = userTools.reduce((acc, t) => acc + (t.upvotesCount || 0), 0)
  const totalProductLikes = userProducts.reduce((acc, p) => acc + (p.likesCount || 0), 0)
  const totalToolComments = userTools.reduce((acc, t) => acc + (t.commentsCount || 0), 0)
  const totalProductComments = userProducts.reduce((acc, p) => acc + (p.commentsCount || 0), 0)
  const totalToolViews = userTools.reduce((acc, t) => acc + (t.viewsCount || 0), 0)
  const totalProductViews = userProducts.reduce((acc, p) => acc + (p.viewsCount || 0), 0)
  const totalBuilds = userTools.reduce((acc, t) => acc + (t.buildsCount || 0), 0)

  return {
    tools: userTools as unknown as DbTool[],
    products: userProducts as unknown as DbProduct[],
    comments: unifiedComments,
    stats: {
      totalTools: userTools.length,
      totalProducts: userProducts.length,
      totalUpvotesAndLikes: totalToolUpvotes + totalProductLikes,
      totalComments: totalToolComments + totalProductComments,
      totalViews: totalToolViews + totalProductViews,
      totalBuilds,
    },
  }
}
