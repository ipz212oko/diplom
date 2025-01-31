import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";

const linkRecipe = defineRecipe({
  base: {
    focusRing: "none",
  },
})

const headingRecipe = defineRecipe({
  base: {
    fontFamily: "inherit",
  },
})

const config = defineConfig({
  globalCss: {
    "*": {
      "--global-font-body": "'Montserrat', sans-serif"
    },
    "html, body": {
      h: "100%",
    },
    "#root": {
      h: "100%",
      bg: "#fbfbfd"
    }
  },
  theme: {
    recipes: {
      link: linkRecipe,
      heading: headingRecipe,
    },
  },
})

export const system = createSystem(defaultConfig, config);