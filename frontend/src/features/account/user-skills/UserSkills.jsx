import { useAuth } from "@/providers/AuthProvider.jsx";
import { createListCollection } from "@ark-ui/react";
import { useMemo, useState } from "react";
import {
  ComboBoxContent,
  ComboBoxControl,
  ComboBoxInput, ComboBoxItem, ComboBoxItemIndicator, ComboBoxItemText,
  ComboBoxPositioner,
  ComboBoxRoot
} from "@/components/ui/combo-box.jsx";
import {
  TagsInputControl, TagsInputInput,
  TagsInputItem, TagsInputItemDeleteTrigger,
  TagsInputItemPreview,
  TagsInputItemText,
  TagsInputRoot
} from "@/components/ui/tags-input.jsx";
import { LuCheck } from "react-icons/lu";
import { axiosInstance } from "@/utils/axiosInstance.js";
import { toaster } from "@/components/ui/toaster.jsx";

export function UserSkills({ userSkills = [], skillsList = [] }) {
  const { user } = useAuth();

  const initialCollection = useMemo(() => (
    createListCollection({ items: skillsList })
  ), [skillsList]);

  const defaultValue = useMemo(() =>({
    items: userSkills,
    value: userSkills?.map(skill => skill.value)
  }), [userSkills]);

  const [collection, setCollection] = useState(initialCollection);
  const [selected, setSelected] = useState(defaultValue);

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

  const handleDeleteSkill = async ({ value }) => {
    try {
      await axiosInstance.delete(`/users/${user.id}/skills/${value}`);

      setSelected(prevState => ({
        items: prevState.items.filter(item => item.value != value),
        value: prevState.value.filter(item => item != value),
      }))
    } catch (error) {
      toaster.create({
        title: "Помилка",
        description: error.message,
        type: "error",
      })
    }
  };

  const handleAddSkill = async (selectedSkill) => {
    try {
      await axiosInstance.post(`/users/${user.id}/skills/${selectedSkill.value}`);

      setSelected(prevState => ({
        items: [...prevState.items, {...selectedSkill}],
        value: [...prevState.value, selectedSkill.value],
      }))
    } catch (error) {
      toaster.create({
        title: "Помилка",
        description: error.message,
        type: "error",
      })
    }
  };

  const handleSelectValue = async (item) => {
    const checked = selected.value.includes(item.value);

    if (checked) {
      await handleDeleteSkill(item);
    } else {
      await handleAddSkill(item);
    }
  }

  return (
    <ComboBoxRoot
      onOpenChange={handleOpenChange}
      onInputValueChange={handleInputChange}
      onValueChange={() => {}}
      value={selected.value}
      collection={collection}
      selectionBehavior="preserve"
      openOnClick={true}
      closeOnSelect={false}
      asChild
      multiple
      placeholder="Додати навичку"
    >
      <TagsInputRoot editable={false}>
        <ComboBoxControl asChild>
          <TagsInputControl>
            {selected.items.map((item, index) => (
              <TagsInputItem key={index} index={index} value={item.value}>
                <TagsInputItemPreview>
                  <TagsInputItemText>{item.label}</TagsInputItemText>
                  <TagsInputItemDeleteTrigger onClick={() => handleDeleteSkill(item)} />
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
              <ComboBoxItem key={item.value} item={item} onClick={() => handleSelectValue(item)}>
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