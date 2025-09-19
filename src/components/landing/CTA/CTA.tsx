import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Users } from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <Container size="xl" className="relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Stack gap="xl" align="center">
            {/* Badge */}
            <Badge 
              size="lg" 
              variant="light" 
              color="white" 
              className="glass-card text-white border-white/30"
            >
              🚀 Ready to Transform Your AI Journey?
            </Badge>

            {/* Headline */}
            <Title 
              order={2} 
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Start Your AI Assessment
              <br />
              <span className="text-yellow-300">Today</span>
            </Title>

            {/* Subheadline */}
            <Text 
              size="xl" 
              className="max-w-3xl mx-auto opacity-90 leading-relaxed"
            >
              Join thousands of organizations who have accelerated their AI transformation. 
              Get started with our comprehensive assessment in under 5 minutes.
            </Text>

            {/* Benefits */}
            <Group justify="center" gap="xl" className="my-8">
              <Group gap="xs">
                <CheckCircle size={20} className="text-green-300" />
                <Text>Free to start</Text>
              </Group>
              <Group gap="xs">
                <Clock size={20} className="text-blue-300" />
                <Text>5-minute setup</Text>
              </Group>
              <Group gap="xs">
                <Users size={20} className="text-purple-300" />
                <Text>10,000+ users</Text>
              </Group>
            </Group>

            {/* CTA Buttons */}
            <Group justify="center" gap="md">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  to="/register"
                  size="xl"
                  className="bg-white text-indigo-600 hover:bg-gray-50 font-bold px-10 py-4 rounded-full shadow-2xl"
                  rightSection={<ArrowRight size={20} />}
                >
                  Get Started Free
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  to="/login"
                  variant="outline"
                  size="xl"
                  className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8 py-4 rounded-full"
                >
                  Sign In
                </Button>
              </motion.div>
            </Group>

            {/* Trust indicators */}
            <Text size="sm" className="opacity-75 mt-6">
              No credit card required • Enterprise security • GDPR compliant
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;