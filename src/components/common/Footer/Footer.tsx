import React from 'react';
import { Container, Text, Group, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <Container className="container">
        <Group justify="space-between" align="center">
          <Text>&copy; {new Date().getFullYear()} AI Assessment Platform. All rights reserved.</Text>
          <Group>
            <Anchor component={Link} to="/terms" c="white" underline="hover">Terms</Anchor>
            <Anchor component={Link} to="/privacy" c="white" underline="hover">Privacy</Anchor>
            <Anchor component={Link} to="/contact" c="white" underline="hover">Contact</Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;