import { Container, Title, TextInput, PasswordInput, Button, Paper } from '@mantine/core';

const LoginPage = () => {
  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Title ta="center">Login</Title>
        <TextInput label="Email" placeholder="you@mantine.dev" required mt="md" />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl">Sign in</Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;