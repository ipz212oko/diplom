import { createSlotRecipeContext} from "@chakra-ui/react";
import { TagsInput as ArkTagsInput } from '@ark-ui/react'
import { LuCheck, LuX } from "react-icons/lu";

const {
  withProvider,
  withContext,
} = createSlotRecipeContext({ key: "tagsInput" });

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputRootProvider = withProvider(ArkTagsInput.RootProvider, "root", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputRoot = withProvider(ArkTagsInput.Root, "root", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputClearTrigger = withContext(ArkTagsInput.ClearTrigger, "clearTrigger", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputControl = withContext(ArkTagsInput.Control, "control", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputHiddenInput = withContext(ArkTagsInput.HiddenInput, "hiddenInput", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputInput = withContext(ArkTagsInput.Input, "input", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputItem = withContext(ArkTagsInput.Item, "item", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputItemDeleteTrigger = withContext(ArkTagsInput.ItemDeleteTrigger, "itemDeleteTrigger", {
  forwardAsChild: true,
  defaultProps: {
    children: <LuX/>,
  },
})

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputItemInput = withContext(ArkTagsInput.ItemInput, "itemInput", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputItemPreview = withContext(ArkTagsInput.ItemPreview, "itemPreview", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputItemText = withContext(ArkTagsInput.ItemText, "itemText", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputItemLabel = withContext(ArkTagsInput.Label, "label", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const TagsInputContext = ArkTagsInput.Context
export const TagsInputItemContext = ArkTagsInput.ItemContext

////////////////////////////////////////////////////////////////////////////////////
