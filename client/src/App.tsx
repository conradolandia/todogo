import './App.css'
import { Container, Stack } from '@chakra-ui/react'
import Navbar from './components/Navbar'

const height = `calc(100vh - var(--padding) * 2)`

function App() {
  return (
    <Stack direction="column" gap={4} align="center" justify="center" h={height}>
      <Navbar />
      <Container maxW="container.xl">
        {/* <TodoForm />
        <TodoList /> */}
      </Container>
    </Stack>
  )
}

export default App
