import { Box, type BoxProps } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";

const bgColor = {
  info: "lc.primary100",
  success: "lc.success100",
  warning: "lc.warning100",
  danger: "lc.danger100",
};

const textColor = {
  info: "lc.primary900",
  success: "lc.success900",
  warning: "lc.warning900",
  danger: "lc.danger900",
};

const boxShadow = {
  info: "inset 4px 0px 0px #0BB1CB",
  success: "inset 4px 0px 0px #37BE6E",
  warning: "inset 4px 0px 0px #FFC107",
  danger: "inset 4px 0px 0px #D72D2D",
};

const Alert = ({
  status = "info",
  p,
  ...rest
}: BoxProps & {
  status?: "success" | "warning" | "danger" | "info";
}) => {
  return (
    <Box
      boxShadow={boxShadow[status]}
      {...fontStyle.body1bold}
      bgColor={bgColor[status]}
      color={textColor[status]}
      borderRadius="8px"
      p={p ?? "16px"}
      {...rest}
    />
  );
};

export default Alert;
