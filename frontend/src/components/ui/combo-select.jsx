import { useState } from "react";
import { createListCollection } from "@ark-ui/react";
import { LuCheck } from "react-icons/lu";
import {
  ComboBoxContent,
  ComboBoxControl,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxItemIndicator,
  ComboBoxItemText, ComboBoxLabel,
  ComboBoxPositioner,
  ComboBoxRoot
} from "@/components/ui/combo-box.jsx";
import {
  TagsInputControl,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDeleteTrigger,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputRoot
} from "@/components/ui/tags-input.jsx";

export const ComboSelect = (props) => {
  const { notFoundMessage, items, onValueChange, onSelectValue, label, ...restProps } = props;

  const initialCollection = createListCollection({
    items: items || [],
  })

  const [collection, setCollection] = useState(initialCollection);
  const [selected, setSelected] = useState({ items: [], value: [] });

  const handleInputChange = ({ inputValue }) => {
    const filtered = initialCollection.items.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    )

    if(filtered.length === 0) {
      filtered.push({
        label: notFoundMessage || "Нічого не знайдено",
        value: "not-found",
        disabled: true
      })
    }

    setCollection(createListCollection({ items: filtered }));
  }

  const handleOpenChange = () => {
    setCollection(initialCollection)
  }

  const handleChangeValue = (details) => {
    setSelected(details);

    if(onValueChange) {
      onValueChange(details);
    }
  };

  const handleSelectValue = (item) => {
    const checked = selected.value.includes(item);

    if(onSelectValue) {
      onSelectValue(item, checked);
    }
  }

  const handleDeleteValue = (value) => setSelected(prevState => ({
    items: prevState.items.filter(item => item.value != value),
    value: prevState.value.filter(item => item != value),
  }));

  return (
    <ComboBoxRoot
      onOpenChange={handleOpenChange}
      onInputValueChange={handleInputChange}
      onValueChange={handleChangeValue}
      value={selected.value}
      collection={collection}
      selectionBehavior="preserve"
      openOnClick={true}
      closeOnSelect={false}
      asChild
      multiple
      {...restProps}
    >
      <TagsInputRoot editable={false}>
        {label && <ComboBoxLabel>{label}</ComboBoxLabel>}
        <ComboBoxControl asChild>
          <TagsInputControl>
            {selected.items.map((item, index) => (
              <TagsInputItem key={index} index={index} value={item.value}>
                <TagsInputItemPreview>
                  <TagsInputItemText>{item.label}</TagsInputItemText>
                  <TagsInputItemDeleteTrigger onClick={() => handleDeleteValue(item.value)} />
                </TagsInputItemPreview>
              </TagsInputItem>
            ))}
            <ComboBoxInput asChild>
              <TagsInputInput/>
            </ComboBoxInput>
          </TagsInputControl>
        </ComboBoxControl>
        <ComboBoxPositioner>
          <ComboBoxContent>
            {collection.items.map((item) => (
              <ComboBoxItem key={item.value} item={item} onClick={() => handleSelectValue(item.value)}>
                <ComboBoxItemText>{item.label}</ComboBoxItemText>
                <ComboBoxItemIndicator>
                  <LuCheck />
                </ComboBoxItemIndicator>
              </ComboBoxItem>
            ))}
          </ComboBoxContent>
        </ComboBoxPositioner>
      </TagsInputRoot>
    </ComboBoxRoot>
  )
}