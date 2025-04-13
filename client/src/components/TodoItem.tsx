import { BASE_URL } from "@/App";
import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useColorModeValue } from "./ui/color-mode";

const TodoItem = ({ todo }: { todo: any }) => {
  const queryClient = useQueryClient();

  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !todo.completed }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async (id: string) => {
      try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const colorCompleted = useColorModeValue("green.600", "green.200");
  const colorInProgress = useColorModeValue("yellow.600", "yellow.100");
  const colorDelete = useColorModeValue("red.700", "red.400");

  return (
    <Flex gap={2} alignItems={"center"}>
      <Flex
        flex={1}
        alignItems={"center"}
        border={"1px"}
        borderColor={"gray.600"}
        p={2}
        borderRadius={"lg"}
        justifyContent={"space-between"}
      >
        <Text
          color={todo.completed ? colorCompleted : colorInProgress}
          textDecoration={todo.completed ? "line-through" : "none"}
        >
          {todo.body}
        </Text>
        {todo.completed && (
          <Badge ml="1" colorScheme="green">
            Hecho
          </Badge>
        )}
        {!todo.completed && (
          <Badge ml="1" colorScheme="yellow">
            En progreso
          </Badge>
        )}
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Box
          color={todo.completed ? colorCompleted : colorInProgress}
          cursor={"pointer"}
          onClick={() => updateTodo(todo._id)}
        >
          { isUpdating 
            ? <Spinner size={"xs"} /> 
            : todo.completed 
              ? <FaCheckCircle size={20} /> 
              : <FaQuestionCircle size={20} />}
        </Box>
        <Box
          color={colorDelete}
          cursor={"pointer"}
          onClick={() => deleteTodo(todo._id)}
        >
          {isDeleting ? <Spinner size={"xs"} /> : <MdDelete size={25} />}
        </Box>
      </Flex>
    </Flex>
  );
};

export default TodoItem;
