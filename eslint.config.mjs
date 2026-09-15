import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["atomity-challenge-src/**", "*.eml", "*.mp4", "*.zip"],
  },
];

export default eslintConfig;
