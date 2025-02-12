import { useMemo, useState } from "react";
import {
  ComboBoxContent,
  ComboBoxControl,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxItemIndicator,
  ComboBoxItemText,
  ComboBoxLabel,
  ComboBoxPositioner,
  ComboBoxRoot,
} from "@/components/ui/combo-box.jsx";
import { createListCollection } from "@ark-ui/react";
import { Input } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";

export function SearchSelect(props) {
  const { label, items = [], placeholder, ...restProps } = props;

  const initialCollection = useMemo(() => (
    createListCollection({ items })
  ), [items]);

  const [collection, setCollection] = useState(initialCollection)

  const handleInputChange = ({ inputValue }) => {
    const filtered = initialCollection.items.filter((item) =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    )

    if(filtered.length === 0) {
      filtered.push({
        label: "Нічого не знайдено",
        value: "not-found",
        disabled: true
      })
    }

    setCollection(createListCollection({ items: filtered }));
  }

  const handleOpenChange = () => setCollection(initialCollection);

  return (
    <ComboBoxRoot
      onInputValueChange={handleInputChange}
      onOpenChange={handleOpenChange}
      collection={collection}
      selectionBehavior="replace"
      openOnClick={true}
      {...restProps}
    >
      {label && <ComboBoxLabel>{label}</ComboBoxLabel>}
      <ComboBoxControl>
        <ComboBoxInput asChild>
          <Input />
        </ComboBoxInput>
      </ComboBoxControl>
      <ComboBoxPositioner>
        <ComboBoxContent>
          {collection.items.map((item) => (
            <ComboBoxItem key={item.value} item={item}>
              <ComboBoxItemText>{item.label}</ComboBoxItemText>
              <ComboBoxItemIndicator>
                <LuCheck />
              </ComboBoxItemIndicator>
            </ComboBoxItem>
          ))}
        </ComboBoxContent>
      </ComboBoxPositioner>
    </ComboBoxRoot>
  )
}