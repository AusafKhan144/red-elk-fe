import { AppShell, Header, Navbar, Text, Group, Button, Avatar, Menu } from '@mantine/core';
import { IconUser, IconLogout, IconDashboard, IconClipboardList } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { label: 'Dashboard', href: '/dashboard', icon: IconDashboard },
    { label: 'Assessments', href: '/assessments', icon: IconClipboardList },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <Header>
        <Group justify="space-between" style={{ height: '100%' }} px="md">
          <Text size="xl" fw={700}>AI Assessment Platform</Text>
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" leftSection={<Avatar size={30} />}>
                {user?.full_name || user?.email}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconUser size={14} />}>
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={14} />} onClick={logout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Header>

      <Navbar p="md">
        {navigation.map((item) => (
          <Button
            key={item.href}
            component={Link}
            to={item.href}
            variant={location.pathname === item.href ? 'filled' : 'subtle'}
            leftSection={<item.icon size={16} />}
            justify="flex-start"
            fullWidth
            mb="xs"
          >
            {item.label}
          </Button>
        ))}
      </Navbar>

      <main>{children}</main>
    </AppShell>
  );
};