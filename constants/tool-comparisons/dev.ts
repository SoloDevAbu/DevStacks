import type { ToolPairNotes } from "@/types/alternatives"

export const PLAYWRIGHT_PAIRS: ToolPairNotes = {
  cypress: {
    verdict:
      "Cypress runs tests inside the browser with an interactive runner and time-travel debugging, and is strongest on Chromium-family browsers. Playwright drives Chromium, Firefox and WebKit from outside the browser, with multiple tabs, origins and parallel workers built in.",
    chooseTool: [
      "You need Safari (WebKit) coverage, multiple tabs or cross-origin flows.",
      "You want free parallel runs and sharding without a paid dashboard.",
    ],
    chooseAlternative: [
      "Your team values Cypress's interactive runner and debugging experience.",
      "You also want component testing inside the same tool and Cypress Cloud reporting.",
    ],
  },
  selenium: {
    verdict:
      "Selenium is the W3C WebDriver standard with bindings for almost every language and a large grid ecosystem. Playwright is newer and faster to write, with auto-waiting, tracing and built-in browser downloads.",
    chooseTool: [
      "You are starting a new suite and want fast, reliable tests with little flakiness.",
      "You want trace viewer, codegen and network mocking out of the box.",
    ],
    chooseAlternative: [
      "You have a large existing Selenium suite or Selenium Grid.",
      "You need real-device or legacy browser coverage through WebDriver vendors.",
    ],
  },
  puppeteer: {
    verdict:
      "Puppeteer is Google's Node.js library for automating Chrome and Firefox, popular for scraping, PDFs and screenshots. Playwright came from the same original team and adds a test runner, WebKit and more languages.",
    chooseTool: [
      "You are writing end-to-end tests and want a full test runner.",
      "You need Python, Java or .NET, or WebKit coverage.",
    ],
    chooseAlternative: [
      "You only automate Chrome for scraping, PDFs or screenshots in Node.js.",
      "You want the tool maintained by the Chrome team.",
    ],
  },
  webdriverio: {
    verdict:
      "WebdriverIO is a Node.js framework on top of WebDriver and WebDriver BiDi, with strong mobile testing through Appium. Playwright uses its own protocol for fast desktop-browser testing.",
    chooseTool: [
      "You test web apps on desktop browsers and want speed and tracing.",
      "You prefer a single tool with codegen and a built-in runner.",
    ],
    chooseAlternative: [
      "You need native mobile app testing through Appium in the same framework.",
      "You want to stay on the WebDriver standard for vendor grids.",
    ],
  },
}

export const NEXTJS_PAIRS: ToolPairNotes = {
  "react-router": {
    verdict:
      "React Router v7 (which absorbed Remix) is a React framework built on web standards, loaders and actions, and deploys almost anywhere. Next.js adds React Server Components, built-in caching and tight Vercel integration.",
    chooseTool: [
      "You want React Server Components, ISR and a large ecosystem of examples.",
      "You deploy on Vercel or want image, font and metadata APIs built in.",
    ],
    chooseAlternative: [
      "You prefer web-standard forms, loaders and actions with less framework magic.",
      "You want to migrate an existing React Router app step by step.",
    ],
  },
  astro: {
    verdict:
      "Astro ships zero JavaScript by default and hydrates only interactive islands, which makes it ideal for content sites. Next.js is a full-stack React framework for highly interactive apps.",
    chooseTool: [
      "You are building an interactive app with auth, dashboards and server actions.",
      "Your team is all-in on React.",
    ],
    chooseAlternative: [
      "You are building a content, docs or marketing site where speed and SEO matter most.",
      "You want to mix React, Vue, Svelte or no framework at all.",
    ],
  },
  sveltekit: {
    verdict:
      "SvelteKit is the full-stack framework for Svelte, compiling components to small, fast JavaScript. Next.js is the React equivalent with a larger hiring pool and ecosystem.",
    chooseTool: [
      "You need React libraries or a team that already knows React.",
      "You want the largest ecosystem of tutorials, components and hosting support.",
    ],
    chooseAlternative: [
      "You want less boilerplate and smaller bundles with Svelte 5 runes.",
      "Your team is happy to adopt Svelte for a new project.",
    ],
  },
  vite: {
    verdict:
      "Vite is a build tool and dev server, not a full framework, often used for single-page React apps. Next.js is a framework with routing, server rendering and data fetching built in.",
    chooseTool: [
      "You need server rendering, SEO and API routes in one project.",
      "You want file-based routing and conventions decided for you.",
    ],
    chooseAlternative: [
      "You are building a client-side SPA or dashboard behind a login.",
      "You want the fastest dev server and full control over routing and data.",
    ],
  },
}

export const PRISMA_PAIRS: ToolPairNotes = {
  "drizzle-orm": {
    verdict:
      "Drizzle is a lightweight TypeScript ORM where the schema is TypeScript code and queries read like SQL, with no generation step. Prisma uses its own schema language and a generated client with a higher-level query API and Studio.",
    chooseTool: [
      "You want a declarative schema, generated types and an easy API for teams new to SQL.",
      "You value Prisma Studio, Prisma Migrate and the wider Prisma tooling.",
    ],
    chooseAlternative: [
      "You want SQL-like queries, no code generation and a small bundle for serverless and edge.",
      "You prefer defining schema in TypeScript next to your code.",
    ],
  },
  typeorm: {
    verdict:
      "TypeORM is a decorator-based ORM with Active Record and Data Mapper patterns, familiar to developers from Java or C#. Prisma offers stronger type safety through its generated client.",
    chooseTool: [
      "You want end-to-end type safety on query results.",
      "You are starting a new TypeScript project.",
    ],
    chooseAlternative: [
      "You use NestJS or class-based entities with decorators.",
      "You maintain an existing TypeORM codebase.",
    ],
  },
  kysely: {
    verdict:
      "Kysely is a type-safe SQL query builder, not a full ORM: you write SQL-shaped queries with full TypeScript inference. Prisma manages schema, migrations and relations for you.",
    chooseTool: [
      "You want migrations, relations and a schema managed in one tool.",
      "You prefer a high-level API over writing joins.",
    ],
    chooseAlternative: [
      "You want full control of SQL with type safety and no runtime engine.",
      "You already manage the schema with another migration tool.",
    ],
  },
  sequelize: {
    verdict:
      "Sequelize is a long-standing promise-based ORM for Node.js with Postgres, MySQL, SQLite and MSSQL support. Prisma is TypeScript-first, with stricter types and a newer developer experience.",
    chooseTool: [
      "You build in TypeScript and want generated, accurate types.",
      "You want a modern migration workflow.",
    ],
    chooseAlternative: [
      "You maintain an existing JavaScript codebase on Sequelize.",
      "You need its mature model hooks and dialect coverage.",
    ],
  },
}

export const POSTMAN_PAIRS: ToolPairNotes = {
  insomnia: {
    verdict:
      "Insomnia is Kong's API client for REST, GraphQL, gRPC and WebSockets, with local, Git or cloud storage. Postman is a broader API platform with workspaces, monitors, mock servers and governance.",
    chooseTool: [
      "You want team workspaces, monitors, mocks and API documentation in one platform.",
      "Your organisation already shares collections in Postman.",
    ],
    chooseAlternative: [
      "You want a focused, lighter client with local-only storage options.",
      "You work heavily with GraphQL and gRPC.",
    ],
  },
  bruno: {
    verdict:
      "Bruno is an open-source, offline API client that stores collections as plain-text files in your Git repo. Postman stores collections in its cloud and adds collaboration and monitoring features.",
    chooseTool: [
      "You need cloud collaboration, monitoring and mock servers.",
      "Non-developers on your team use API collections too.",
    ],
    chooseAlternative: [
      "You want API collections versioned in Git next to your code.",
      "You want no account or cloud sync for privacy or compliance.",
    ],
  },
  hoppscotch: {
    verdict:
      "Hoppscotch is an open-source, browser-based API client that you can also self-host. Postman is a full API lifecycle platform with desktop apps and enterprise features.",
    chooseTool: [
      "You need API governance, testing at scale and enterprise SSO.",
      "You rely on Postman's public API network.",
    ],
    chooseAlternative: [
      "You want a fast, free client that runs in the browser.",
      "You want to self-host your team's API workspace.",
    ],
  },
  "thunder-client": {
    verdict:
      "Thunder Client is a lightweight REST client that runs inside VS Code. Postman is a standalone platform with far more collaboration and automation features.",
    chooseTool: [
      "You share collections across a team and run automated API tests.",
      "You test GraphQL, gRPC or WebSockets regularly.",
    ],
    chooseAlternative: [
      "You want to send quick requests without leaving VS Code.",
      "You only need simple REST requests and environment variables.",
    ],
  },
}
