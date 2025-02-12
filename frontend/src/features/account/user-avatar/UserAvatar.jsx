import { Box, Center, Spinner, Avatar, IconButton } from "@chakra-ui/react";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-upload.jsx";
import { LuTrash2, LuUserRound } from "react-icons/lu";
import { useApi } from "@/hooks/useApi.js";
import { useNavigate } from "react-router";
import { useAuth } from "@/providers/AuthProvider.jsx";
import { toaster } from "@/components/ui/toaster.jsx";

export function UserAvatar() {
  const navigate = useNavigate()
  const { user } = useAuth();

  const { request: uploadAvatar, loading: uploadingAvatar } = useApi(
    `/users/${user.id}/image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

  const { request: deleteAvatar, loading: deletingAvatar } = useApi(
    `/users/${user.id}/image`,
    {
      method: "DELETE",
    });

  const uploadImage = async (details) => {
    const image = details?.files?.[0];

    if(!image) {
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      await uploadAvatar(formData);
      navigate(0);
    } catch (error) {
      toaster.create({
        title: "Помилка",
        description: error.message,
        type: "error",
      })
    }
  }

  const deleteImage = async () => {
    try {
      await deleteAvatar();
      navigate(0);
    } catch (error) {
      toaster.create({
        title: "Помилка",
        description: error.message,
        type: "error",
      })
    }
  }

  const image = (
    <Avatar.Root boxSize="200px">
      <Avatar.Fallback asChild w="50%" h="50%"><LuUserRound/></Avatar.Fallback>
      <Avatar.Image src={user.image} />
    </Avatar.Root>
  );

  return (
    <Box mx="auto">
      {user?.image
        ? (
          <Box pos="relative" className="group">
            {image}
            <IconButton
              variant="ghost"
              pos="absolute"
              display="none"
              left="50%"
              bottom={0}
              transform="translate(-50%, 0)"
              rounded="full"
              color="red"
              _groupHover={{ display: "flex" }}
              disabled={deletingAvatar}
              onClick={deleteImage}
            >
              <LuTrash2/>
            </IconButton>
          </Box>
        )
        : (
          <FileUploadRoot pos="relative" accept={["image/png", "image/jpg", "image/jpeg"]} onFileAccept={uploadImage}>
            <FileUploadTrigger asChild>{image}</FileUploadTrigger>
            {uploadingAvatar && (
              <Box pos="absolute" inset="0" bg="bg/80">
                <Center h="full">
                  <Spinner />
                </Center>
              </Box>
            )}
          </FileUploadRoot>
        )
      }
    </Box>
  )
}