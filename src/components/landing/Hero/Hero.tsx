import { Container, Title, Text, Button, Group, Badge, } from '@mantine/core';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Star, Users, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hero-pattern" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <Container size="xl" className="relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Group justify="center" gap="lg" className="mb-6">
              <Badge 
                size="lg" 
                variant="light" 
                color="white" 
                className="glass-card text-white border-white/30"
                leftSection={<Star size={14} />}
              >
                4.9/5 Rating
              </Badge>
              <Badge 
                size="lg" 
                variant="light" 
                color="white" 
                className="glass-card text-white border-white/30"
                leftSection={<Users size={14} />}
              >
                10,000+ Users
              </Badge>
              <Badge 
                size="lg" 
                variant="light" 
                color="white" 
                className="glass-card text-white border-white/30"
                leftSection={<Award size={14} />}
              >
                Industry Leading
              </Badge>
            </Group>
          </motion.div>

          {/* Main headline */}
          <Title 
            order={1} 
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            Transform Your
            <br />
            <span className="gradient-text bg-gradient-to-r from-yellow-400 to-pink-400">
              AI Journey
            </span>
          </Title>

          {/* Subtitle */}
          <Text 
            size="xl" 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light opacity-90"
          >
            Unlock your organization's AI potential with comprehensive assessments, 
            real-time progress tracking, and actionable insights from industry experts.
          </Text>

          {/* CTA Buttons */}
          <Group justify="center" gap="md" className="mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                component={Link}
                to="/register"
                size="xl"
                className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full shadow-2xl"
                rightSection={<ArrowRight size={20} />}
              >
                Start Free Assessment
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="xl"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-8 py-4 rounded-full"
                leftSection={<Play size={20} />}
              >
                Watch Demo
              </Button>
            </motion.div>
          </Group>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm opacity-75"
          >
            <Text>
              Trusted by leading companies worldwide • No credit card required • 5-minute setup
            </Text>
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-16 fill-white">
          <path d="M0,120 C150,100 350,0 600,20 C850,40 1050,100 1200,80 L1200,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;