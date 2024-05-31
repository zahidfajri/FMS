import { Input, useToast, Box, Spinner, Button, Text, Link } from "@chakra-ui/react";
import imgbbUpload from "imgbb-image-uploader";
import { ChangeEvent } from "react";
import { useBooleanState } from "~/utils/hooks";

export default function UploadImage({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const toast = useToast();
  const isUploading = useBooleanState();

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;

    const image = e.target.files[0];

    isUploading.set(true);
    window.onbeforeunload = () => 'You have unsaved changes!';

    const name = `ticket-attachment-${new Date().getTime()}`;
    let response: any;
    try {
      response = await imgbbUpload({
        key: process.env.NEXT_PUBLIC_IMGBB_CLIENT_API_KEY,
        image: image,
        name,
      });
      toast({
        title: "Upload Successful",
        description: "Your image has been uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setValue(response?.data?.image?.url);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Something went wrong while uploading the file.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.error("Failed to upload image to ImgBB:", error);
    } finally {
      isUploading.set(false);
      window.onbeforeunload = null;
    }
  }

  return (
    <Box>
      <Input
        accept="image/png, image/jpeg, image/jpg"
        isDisabled={isUploading.get}
        onChange={onChange}
        id="file-upload"
        display="none"
        type="file"
      />
      <Button
        as="label"
        htmlFor="file-upload"
        isDisabled={isUploading.get}
        cursor={isUploading.get ? "not-allowed" : "pointer"}
      >
        {isUploading.get ? (
          <>
            <Spinner size="sm" mr={2} />
            Uploading...
          </>
        ) : (
          "Upload Image"
        )}
      </Button>
      {value && !isUploading.get && (
        <Text mt={2}>Success attached:{" "}
          <Link href={value} target="_blank" rel="noopener noreferrer">
            {value.split("/")[4]}
          </Link>
        </Text>
      )}
    </Box>
  );
}
