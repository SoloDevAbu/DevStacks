export interface SocialLinkConfig {
  key:
    | "websiteUrl"
    | "githubUrl"
    | "twitterUrl"
    | "linkedinUrl"
    | "discordUrl"
    | "appStoreUrl"
    | "playStoreUrl"
    | "chromeExtensionUrl"
  label: string
  title: string
  logo: string
}

export const SOCIAL_LINK_CONFIGS: SocialLinkConfig[] = [
  {
    key: "websiteUrl",
    label: "Website",
    title: "Official Website",
    logo: "/social-logo/world-wide-web.png",
  },
  {
    key: "githubUrl",
    label: "GitHub",
    title: "GitHub Repository",
    logo: "/social-logo/github.png",
  },
  {
    key: "twitterUrl",
    label: "X (Twitter)",
    title: "Twitter / X Profile",
    logo: "/social-logo/twitter.png",
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    title: "LinkedIn Profile",
    logo: "/social-logo/linkedin.png",
  },
  {
    key: "discordUrl",
    label: "Discord",
    title: "Discord Community",
    logo: "/social-logo/discord.png",
  },
  {
    key: "appStoreUrl",
    label: "App Store",
    title: "Apple App Store",
    logo: "/social-logo/app-store.png",
  },
  {
    key: "playStoreUrl",
    label: "Play Store",
    title: "Google Play Store",
    logo: "/social-logo/playstore.png",
  },
  {
    key: "chromeExtensionUrl",
    label: "Extension",
    title: "Chrome Web Store Extension",
    logo: "/social-logo/chrome.png",
  },
]
