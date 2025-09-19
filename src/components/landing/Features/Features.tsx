import { Container, Title, SimpleGrid, Card, Text, ThemeIcon, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  BarChart3,
  CheckCircle,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'AI Readiness Assessment',
    description: 'Comprehensive evaluation of your organization\'s AI maturity across multiple dimensions.',
    color: 'blue',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Progress Tracking',
    description: 'Monitor your improvement journey with detailed analytics and milestone tracking.',
    color: 'green',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep insights and benchmarking against industry standards and best practices.',
    color: 'purple',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members and track collective progress across your organization.',
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with SOC2, GDPR, and industry standards.',
    color: 'red',
  },
  {
    icon: Zap,
    title: 'Instant Reports',
    description: 'Generate comprehensive PDF reports and recommendations in seconds.',
    color: 'yellow',
  },
  {
    icon: CheckCircle,
    title: 'Action Planning',
    description: 'Get personalized roadmaps and next steps based on your assessment results.',
    color: 'teal',
  },
  {
    icon: Globe,
    title: 'Global Benchmarks',
    description: 'Compare your progress against global industry leaders and peers.',
    color: 'indigo',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Title 
            order={2} 
            className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          >
            Everything You Need to Succeed
          </Title>
          <Text size="xl" className="text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI assessment platform with enterprise-grade features 
            designed to accelerate your digital transformation journey.
          </Text>
        </motion.div>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                shadow="lg" 
                padding="xl" 
                radius="xl" 
                withBorder
                className="h-full bg-white/80 backdrop-blur-sm border-gray-200/50 hover:shadow-2xl transition-all duration-300"
              >
                <Stack gap="md">
                  <ThemeIcon 
                    size={60} 
                    radius="xl" 
                    variant="light" 
                    color={feature.color}
                    className="mb-2"
                  >
                    <feature.icon size={32} />
                  </ThemeIcon>
                  
                  <Title order={4} className="font-semibold text-gray-900">
                    {feature.title}
                  </Title>
                  
                  <Text size="sm" className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </Text>
                </Stack>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Features;