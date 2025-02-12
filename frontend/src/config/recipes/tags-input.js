import { defineSlotRecipe } from "@chakra-ui/react";
import { tagsInputAnatomy } from "@ark-ui/react/tags-input";

export const tagsInputSlotRecipe = defineSlotRecipe({
  className: "chakra-tags-input",
  slots: tagsInputAnatomy.keys(),
  base: {
    root: {
      display: "flex",
      gap: 2,
    },
    control: {
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      px: 3,
      py: 2,
      borderRadius: "l2",
      minH: 10,
      borderWidth: "1px",
      borderColor: "border",
      focusVisibleRing: "inside",
    },
    input: {
      outline: "none",
      w: "full"
    },
    itemPreview: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      py: 1,
      pl: 2,
      pr: 1,
      borderRadius: "l2",
      bg: "colorPalette.subtle",
      color: "colorPalette.fg",
      shadow: "inset 0 0 0px 1px var(--shadow-color)",
      shadowColor: "colorPalette.muted",
    },
    itemText: {
      userSelect: "none",
    },
    itemDeleteTrigger: {
      cursor: "pointer",
    },
    label: {
      fontWeight: "medium",
      userSelect: "none",
      textStyle: "sm",
    },
  },
})