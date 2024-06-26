import { Input, Box, Button, Text, } from "@chakra-ui/react";
import { ChangeEvent, } from "react";

export default function InputFile({
  value,
  setValue,
  buttonText = "Upload Image",
}: {
  value: File | null;
  setValue: (value: File | null) => void;
  buttonText?: string;
}) {

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;
    setValue(e.target.files[0]);
  }

  return (
    <Box>
      <Input
        accept="image/png, image/jpeg, image/jpg"
        onChange={onChange}
        id="file-upload"
        display="none"
        type="file"
      />
      <Button
        as="label"
        htmlFor="file-upload"
      >
        {buttonText}
      </Button>
      {value ? (
        <Text mt={2}>
          Attached file:{" "}
          {value.name}
        </Text>
      ) : <></>}
    </Box>
  );
}
