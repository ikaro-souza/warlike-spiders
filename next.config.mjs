/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import buildBundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer  = buildBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
})

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    images: {
        dangerouslyAllowSVG: true,
        domains: [
            "api.dicebear.com",
            "images.unsplash.com",
            "via.placeholder.com",
        ],
    },
};
export default withBundleAnalyzer(config);
