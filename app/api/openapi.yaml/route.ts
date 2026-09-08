import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const yaml = `openapi: 3.1.0
info:
  title: ${SITE_CONFIG.name} Public API
  summary: Read-only REST API for the developer tools and products catalog.
  description: Public, unauthenticated REST API for ${SITE_CONFIG.name}.
  version: 1.0.0
  contact:
    name: ${SITE_CONFIG.name}
    url: ${SITE_CONFIG.url}/cli
    email: support@devstacks.io
servers:
  - url: ${SITE_CONFIG.url}
    description: Production
paths:
  /v1:
    get:
      summary: Public API index
      responses:
        '200':
          description: API index
  /v1/tools:
    get:
      summary: List developer tools
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: q
          in: query
          schema:
            type: string
        - name: category
          in: query
          schema:
            type: string
        - name: pricing
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Paginated tools
  /v1/tools/{slug}:
    get:
      summary: Get tool by slug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Tool detail
        '404':
          description: Not found
  /v1/products:
    get:
      summary: List developer products
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Paginated products
  /v1/products/{slug}:
    get:
      summary: Get product by slug
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product detail
  /v1/search:
    get:
      summary: Search catalog
      parameters:
        - name: q
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Search hits
  /v1/leaderboard:
    get:
      summary: Community leaderboard
      responses:
        '200':
          description: Ranked items
`

  return new NextResponse(yaml, {
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
