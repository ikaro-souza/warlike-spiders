import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                "elevation-1":
                    "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
            },
            colors: {
                action: "#147efb",
                background: "#f8f8f8",
            },
            fontFamily: {
                sans: [
                    "ui-sans-serif",
                    "system-ui",
                    "Inter",
                    ...defaultTheme.fontFamily.sans.filter(
                        (x) => x !== "ui-sans-serif" && x !== "system-ui",
                    ),
                ],
            },
            animation: {
                "slide-from-bottom": "slide-from-bottom 0.3s ease-out",
            },
            keyframes: {
                "slide-from-bottom": {
                    from: { marginBottom: "-10%" },
                    to: { marginBottom: "0" },
                },
            },
        },
    },
    plugins: [
        require("tailwind-scrollbar-hide"),
        require("@tailwindcss/forms"),
    ],
} satisfies Config;
