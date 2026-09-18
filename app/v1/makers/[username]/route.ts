import { NextResponse } from "next/server"
import { getMakerProfile } from "@/db/queries/users/get-profile"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 60

export const GET = async (
  _request: Request,
  props: { params: Promise<{ username: string }> }
) => {
  const { username } = await props.params
  const maker = await getMakerProfile(username)

  if (!maker) {
    return NextResponse.json(
      {
        type: `${SITE_CONFIG.url}/errors/not-found`,
        title: "Maker Not Found",
        status: 404,
        detail: `Maker '${username}' was not found.`,
      },
      {
        status: 404,
        headers: {
          "Content-Type": "application/problem+json",
        },
      }
    )
  }

  return NextResponse.json(
    { data: maker },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    }
  )
}
