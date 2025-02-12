import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";
import { comboBoxSlotRecipe } from "@/config/recipes/combobox.js";
import { tagsInputSlotRecipe } from "@/config/recipes/tags-input.js";

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
      minH: "100vh",
    },
    "body": {
      display: "flex",
      flexDirection: "column",
    },
    "#root": {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      bg: "#fbfbfd",
    }
  },
  theme: {
    recipes: {
      link: linkRecipe,
      heading: headingRecipe,
    },
    slotRecipes: {
      combobox: comboBoxSlotRecipe,
      tagsInput: tagsInputSlotRecipe,
    }
  },
})

export const system = createSystem(defaultConfig, config);