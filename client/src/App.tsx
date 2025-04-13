import "./App.css";
import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api"
    : "/api";

const height = `calc(100vh - var(--padding) * 2)`;

function App() {
  return (
    <Stack
      direction="column"
      gap={4}
      align="center"
      justify="center"
      h={height}
    >
      <Navbar />
      <Container maxW="container.xl">
        <TodoForm />
        <Container overflow="hidden" overflowY="auto" maxH="50vh">
          <TodoList />
        </Container>
      </Container>
    </Stack>
  );
}

export default App;
