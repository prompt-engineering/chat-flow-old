import React from "react";
import { Box, Container } from "@/components/ChakraUI";
import { getAppData } from "@/i18n";

async function Page() {
  const { i18n } = await getAppData();
  const t = i18n.tFactory("/");

  return (
    <Box mb={ 20 }>
      <Box as='section' pt='6rem' pb={ { base: "0", md: "5rem" } }>
        <Container>
        </Container>
      </Box>
    </Box>
  );
}

export default Page;
