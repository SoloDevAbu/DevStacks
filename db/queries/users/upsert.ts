import { db } from "@/db"
import { users } from "@/db/schema"
import type { NewUser } from "@/db/schema"

export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      },
    })
    .returning()

  return user
}
