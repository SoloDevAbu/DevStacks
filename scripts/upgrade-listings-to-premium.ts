import "dotenv/config"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { ne } from "drizzle-orm"

const main = async () => {
  console.log("Upgrading all existing tools and products to Premium listing tier...")

  try {
    const updatedTools = await db
      .update(tools)
      .set({ tier: "premium" })
      .where(ne(tools.tier, "premium"))
      .returning({ id: tools.id, name: tools.name })

    console.log(`Updated ${updatedTools.length} tools to premium`)

    const updatedProducts = await db
      .update(products)
      .set({ tier: "premium" })
      .where(ne(products.tier, "premium"))
      .returning({ id: products.id, name: products.name })

    console.log(`Updated ${updatedProducts.length} products to premium`)

    console.log("Successfully upgraded all listings to Premium!")
    process.exit(0)
  } catch (error) {
    console.error("Failed to upgrade listings to premium:", error)
    process.exit(1)
  }
}

main()
