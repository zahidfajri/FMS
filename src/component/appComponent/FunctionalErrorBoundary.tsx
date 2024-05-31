/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Flex, Stack, Text } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import { type ReactNode, useEffect, useState, Fragment } from "react";
import { fontStyle } from "~/styles/fontStyle";
import { IS_PRODUCTION } from "~/utils/devTool";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string;
}

const FunctionalErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
}) => {

  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    errorInfo: "",
  });

  const { hasError } = errorState;

  useEffect(() => {
    const handleCatch = (error: Error): void => {
      if (error && error?.message)
        setErrorState({
          hasError: true,
          errorInfo: error.message,
        });
    };
    window.addEventListener("error", (e) => handleCatch(e.error));
    window.addEventListener("unhandledrejection", (e) => handleCatch(e.reason));
    return () => {
      window.removeEventListener("error", (e) => handleCatch(e.error));
      window.removeEventListener("unhandledrejection", (e) =>
        handleCatch(e.reason)
      );
    };
  }, []);

  if (hasError) {
    return (
      <Flex alignItems="center" justify="center" w="100vw" h="100vh">
        <NextSeo title="Client Side Error" />
        <Stack alignItems="center" spacing="20px" p="16px">
          <Text {...fontStyle.captionBold}>
            Client Error
          </Text>
          <Text {...fontStyle.heading5bold} textAlign="center">
            Something went wrong.
          </Text>
          {!IS_PRODUCTION && (
            <Text
              {...fontStyle.body2medium}
              maxW="600px"
              as="code"
            >
              {errorState.errorInfo}
            </Text>
          )}
        </Stack>
      </Flex>
    );
  }

  return <Fragment>{children}</Fragment>;
};

export default FunctionalErrorBoundary;
