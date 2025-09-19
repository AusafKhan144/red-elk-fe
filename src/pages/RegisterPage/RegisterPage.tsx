import React from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Group,
  Anchor,
  Divider,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { User, Mail, Lock } from 'lucide-react';

interface RegisterFormValues {
  email: string;
  password: string;
  name: string;
}

const RegisterPage: React.FC = () => {
  const form = useForm<RegisterFormValues>({
    initialValues: {
      email: '',
      password: '',
      name: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 8 ? null : 'Password must be at least 8 characters',
      name: (value) =>
        value.trim().length > 1 ? null : 'Please enter your name',
    },
  });

  return (
    <Container size={420} my={60}>
      <Title ta="center" order={2} fw={700} mb="xs">
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center">
        Already have an account?{' '}
        <Anchor size="sm" component="button" fw={500}>
          Login
        </Anchor>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p="xl"
        mt="lg"
        radius="lg"
        style={{
          backgroundColor: 'white',
        }}
      >
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              withAsterisk
              leftSection={<User size={18} strokeWidth={1.5} />}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              withAsterisk
              leftSection={<Mail size={18} strokeWidth={1.5} />}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              withAsterisk
              leftSection={<Lock size={18} strokeWidth={1.5} />}
              {...form.getInputProps('password')}
            />
          </Stack>

          <Group justify="space-between" mt="md">
            <Anchor component="button" size="sm" c="blue.6">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="lg" size="md" type="submit" radius="md">
            Create Account
          </Button>

          <Divider my="lg" label="or continue with" labelPosition="center" />

          <Group grow>
            <Button
              variant="outline"
              color="gray"
              radius="md"
              leftSection={<img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width={16} />}
            >
              Google
            </Button>
            <Button
              variant="outline"
              color="gray"
              radius="md"
              leftSection={<img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" width={16} />}
            >
              GitHub
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
