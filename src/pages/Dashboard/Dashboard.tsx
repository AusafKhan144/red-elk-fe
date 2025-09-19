import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Card, Title, Text, Progress } from '@mantine/core'

interface DashboardProps {
  token: string
}

const Dashboard = ({ token }: DashboardProps) => {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axios.get('/api/users/me/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    }
  })

  if (isLoading) return <Text>Loading dashboard...</Text>

  return (
    <div className="container">
      <Title order={1} mb="md">User Dashboard</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Title order={3}>Welcome, {dashboard.user.full_name}</Title>
        <Text>Tier: {dashboard.user.tier}</Text>
        <Text>Total Assessments: {dashboard.stats.total_assessments}</Text>
        <Text>Completed: {dashboard.stats.completed_assessments}</Text>
        <Progress value={(dashboard.stats.completed_assessments / dashboard.stats.total_assessments) * 100 || 0} mb="md" />
      </Card>
      
      <Title order={2} mb="md">Recent Submissions</Title>
      {dashboard.recent_submissions.map((sub: any) => (
        <Card key={sub.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Title order={4}>{sub.assessment.name}</Title>
          <Text>Score: {sub.scores.overall_score}%</Text>
          <Text>Completed: {new Date(sub.completed_at).toLocaleString()}</Text>
        </Card>
      ))}
    </div>
  )
}

export default Dashboard