import { PRICING } from "@/constants/plans"
import type { CuratedAlternatives } from "@/types/alternatives"

export const PLAYWRIGHT_ALTERNATIVES: CuratedAlternatives = {
  toolSlug: "playwright",
  toolName: "Playwright",
  profile: {
    websiteUrl: "https://playwright.dev",
    bestFor:
      "Microsoft's end-to-end testing framework that drives Chromium, Firefox and WebKit from one API, with auto-waiting and parallel runs.",
    license: "Open Source",
    pricing: PRICING.OPEN_SOURCE,
    platforms: "Windows, macOS, Linux",
  },
  intro:
    "Playwright is a free, open-source browser automation and end-to-end testing framework from Microsoft that drives Chromium, Firefox and WebKit. Teams usually look elsewhere for a different developer experience (Cypress), the widest language and grid support (Selenium), or plain Chrome scripting rather than testing (Puppeteer).",
  stickWith: [
    "You need Chromium, Firefox and WebKit coverage from one API.",
    "You rely on its trace viewer, auto-waiting and parallel test runner.",
    "Your tests are written in TypeScript, Python, Java or .NET and you want one framework for all of them.",
  ],
  switchWhen: [
    "Your team prefers an interactive, in-browser test runner (Cypress).",
    "You must run on an existing Selenium Grid or a WebDriver cloud provider (Selenium, WebdriverIO).",
    "You only need to script Chrome for scraping, PDFs or screenshots (Puppeteer).",
  ],
  factsCheckedOn: "2026-11-18",
  alternatives: [
    {
      name: "Cypress",
      websiteUrl: "https://www.cypress.io",
      bestFor:
        "Front-end teams that want an interactive, time-travel test runner in the browser.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web (Chromium, Firefox, WebKit)",
      tags: ["E2E testing", "JavaScript"],
    },
    {
      name: "Selenium",
      websiteUrl: "https://www.selenium.dev",
      bestFor:
        "W3C WebDriver automation in almost any language, with Selenium Grid for scale.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web (all major browsers)",
      tags: ["WebDriver", "Multi-language"],
    },
    {
      name: "Puppeteer",
      websiteUrl: "https://pptr.dev",
      bestFor:
        "Scripting Chrome and Firefox from Node.js for scraping, screenshots and PDFs.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web (Chrome, Firefox)",
      tags: ["Node.js", "Browser automation"],
    },
    {
      name: "WebdriverIO",
      websiteUrl: "https://webdriver.io",
      bestFor:
        "One Node.js framework for browser and native mobile tests over WebDriver, BiDi and Appium.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web, iOS, Android",
      tags: ["Mobile testing", "WebDriver"],
    },
    {
      name: "TestCafe",
      websiteUrl: "https://testcafe.io",
      bestFor:
        "End-to-end tests in Node.js without installing WebDriver or browser plugins.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web (all major browsers)",
      tags: ["E2E testing", "Node.js"],
    },
    {
      name: "Nightwatch.js",
      websiteUrl: "https://nightwatchjs.org",
      bestFor:
        "An all-in-one Node.js testing framework covering end-to-end, component and mobile tests.",
      license: "Open Source",
      pricing: PRICING.OPEN_SOURCE,
      platforms: "Web, iOS, Android",
      tags: ["E2E testing", "Component testing"],
    },
  ],
}
