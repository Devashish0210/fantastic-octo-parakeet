import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: "#E53526", foreground: "#FFFFFF" },
            secondary: "#5591B7",
            content2: {
              //@ts-ignore
              tertiary: "#3A3A3A",
              textSecondary: "#ADADAD",
              text: "#181818",
              textHighlight: "#F89838",
              illustrationOne: "#81B13A",
              illustrationTwo: "#003A69",
              illustrationThree: "#A9C0C1",
              illustrationFour: "#E8E8E8",
            },
          },
        },
      },
    }),
  ],
};
export default config;
