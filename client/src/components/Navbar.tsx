import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode";

export default function Navbar() {
  const bg = useColorModeValue("gray.900", "gray.50");
  const color = useColorModeValue("gray.50", "gray.900");
  return (
    <Container maxW="container.xl">
      <Box bg={bg} px={4} py={2} borderRadius="lg" w="100%">
        <Flex justify="space-between" align="center" p={4} gap={32}>
          {/* Left side */}
          <Text fontSize="2xl" fontWeight="light" color={color}>
            Cosas para hacer
          </Text>
          {/* Right side */}
          <Flex justify="space-between" align="center" p={4} gap={8}>
            <DateDisplay />
            <ColorModeButton bg={bg} color={color} />
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
}

function DateDisplay() {
  const date: Date = new Date();
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;
  const year: number = date.getFullYear();
  const color = useColorModeValue("gray.50", "gray.900");
  return (
    <Text fontSize="2xl" fontWeight="light" color={color}>
      {year}/{month}/{day}
    </Text>
  );
}
