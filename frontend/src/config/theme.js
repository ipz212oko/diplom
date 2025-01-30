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
    "#root": {
      minH: "100dvh",
      bg: "#fbfbfd"
    }
  },
  theme: {
    recipes: {
      link: linkRecipe,
    },
  },
})

export const system = createSystem(defaultConfig, config);