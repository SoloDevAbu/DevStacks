import { NextResponse } from "next/server"
import { seedDatabase } from "@/db/seed"

export const POST = async () => {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Seeding failed" },
      { status: 500 }
    )
  }
}
