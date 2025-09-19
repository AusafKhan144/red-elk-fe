import React from 'react';
import { Container, Title, Text, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container>
      <Title>404 - Page Not Found</Title>
      <Text>The page you're looking for doesn't exist.</Text>
      <Button component={Link} to="/">Go Home</Button>
    </Container>
  );
};

export default NotFound;