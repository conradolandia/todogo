import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "./TodoItem";
import { FaCheckCircle } from "react-icons/fa";

export type Todo = {
  _id: number;
  body: string;
  completed: boolean;
};

const TodoList = () => {
  const { data: todos, isLoading } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:4000/api/todos");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Failed to fetch todos (${response.statusText}): ${data.error}`
          );
        }

        return data || [];
      } catch (error) {
        throw new Error(error as string);
      }
    },
  });

  return (
    <Box py={4}>
      {isLoading && (
        <Flex justifyContent={"center"} my={4}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!isLoading && todos?.length === 0 && (
        <Stack alignItems={"center"} gap="3">
          <Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
            ¡Todas las tareas completadas! 🤞
          </Text>
          <FaCheckCircle size={70} color={"green.500"} />
        </Stack>
      )}
      <Stack gap={3}>
        {todos?.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </Stack>
    </Box>
  );
};

export default TodoList;
