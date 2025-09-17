import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Card, Title, Text, Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

interface AssessmentListProps {
  token: string
}

const AssessmentList = ({ token }: AssessmentListProps) => {
  const navigate = useNavigate()

  const { data: assessments, isLoading, error } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const response = await axios.get('/api/assessments/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    }
  })

  if (isLoading) return <Text>Loading assessments...</Text>
  if (error) return <Text color="red">Error loading assessments</Text>

  return (
    <div className="container">
      <Title order={1} mb="md">Available Assessments</Title>
      {assessments.map((assessment: any) => (
        <Card key={assessment.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Title order={3}>{assessment.name}</Title>
          <Text size="sm" color="dimmed" mb="sm">{assessment.description}</Text>
          <Text size="sm">Category: {assessment.category}</Text>
          <Text size="sm">Dimensions: {assessment.dimensions.length}</Text>
          <Button mt="md" onClick={() => navigate(`/assessments/${assessment.id}`)}>Take Assessment</Button>
        </Card>
      ))}
    </div>
  )
}

export default AssessmentList