import { Button, HStack, Link as BaseLink } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { CloseButton } from "@/components/ui/close-button.jsx";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-upload.jsx";
import { LuUpload } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster.jsx";
import { useApi } from "@/hooks/useApi.js";
import { useAuth } from "@/providers/AuthProvider.jsx";

export function CVFile({ file }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { request: uploadCV, loading: uploadingCV } = useApi(`/users/${user.id}/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  const { request: deleteCV, loading: deletingCV } = useApi(
    `/users/${user.id}/pdf`,
    {
      method: "DELETE",
    });

  const uploadFile = async (details) => {
    const pdf = details?.files?.[0];

    if(!pdf) {
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);

    try {
      await uploadCV(formData);
      navigate(0);
    } catch (error) {
      toaster.create({
        title: "Помилка",
        description: error.message,
        type: "error",
      })
    }
  }

  const deleteFile = async () => {
    try {
      await deleteCV();
      navigate(0);
    } catch (error) {
      toaster.create({
        title: "Помилка",
        description: error.message,
        type: "error",
      })
    }
  }

  return file ? (
    <HStack justify="space-between" w={36} px={2} py={1} borderWidth="1px" rounded="md">
      <BaseLink as={Link} to={file}>Резюме</BaseLink>
      <CloseButton size="2xs" onClick={deleteFile} disabled={deletingCV} />
    </HStack>
  ) : (
    <FileUploadRoot accept={["application/pdf"]} onFileAccept={uploadFile}>
      <FileUploadTrigger asChild>
        <Button variant="outline" size="sm" loading={uploadingCV}>
          <LuUpload/> Завантажити
        </Button>
      </FileUploadTrigger>
    </FileUploadRoot>
  );
}