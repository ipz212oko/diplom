import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";

const linkRecipe = defineRecipe({
  base: {
    focusRing: "none",
  },
})

const config = defineConfig({
  globalCss: {
    "*": {
      fontFamily: "'Montserrat', sans-serif",
    },
    "html, body": {
      height: "100dvh",
    },
    "#root": {
      height: "100%",
    }
  },
  theme: {
    recipes: {
      link: linkRecipe,
    },
  },
})

export const system = createSystem(defaultConfig, config);