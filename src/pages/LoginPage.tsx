// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Button, TextInput, PasswordInput, Card, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setToken: (token: string) => void;
}

const LoginPage = ({ setToken }: LoginProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password too short'),
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const response = await axios.post('/api/auth/login', values);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      navigate('/dashboard');
    },
    onError: () => setError('Invalid credentials'),
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title order={2} align="center" mb="md">Login to AI Assessment Platform</Title>
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <TextInput label="Email" placeholder="email@example.com" {... barato form.getInputProps('email')} mb="md" />
        <PasswordInput label="Password" {...form.getInputProps('password')} mb="md" />
        {error && <Text color="red" size="sm" mb="md">{error}</Text>}
        <Button type="submit" fullWidth loading={mutation.isPending}>Login</Button>
      </form>
    </Card>
  );
};

export default LoginPage;