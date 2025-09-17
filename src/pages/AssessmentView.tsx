import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Progress, Card, Title, Text, Button, Group, NumberInput, Checkbox, Radio, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'

interface AssessmentViewProps {
  token: string
}

const AssessmentView = ({ token }: AssessmentViewProps) => {
  const { id } = useParams()
  const [progress, setProgress] = useState(0)

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      const response = await axios.get(`/api/assessments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    }
  })

  const form = useForm({
    initialValues: {},
  })

  interface SubmissionData {
    company_name: string
    responses: any
    tier_used: string
  }

  const mutation = useMutation({
    mutationFn: async (submissionData: SubmissionData) => {
      const response = await axios.post(`/api/assessments/${id}/submit`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    },
    onSuccess: (data) => {
      console.log('Submission successful:', data)
      alert(`Assessment submitted! Overall Score: ${data.scores.overall_score}%`)
    }
  })

  if (isLoading) return <Text>Loading assessment...</Text>

  const totalQuestions = assessment.dimensions.reduce((sum: number, dim: any) => sum + dim.questions.length, 0)

  const handleSubmit = (values: any) => {
    mutation.mutate({
      company_name: "Test Company",
      responses: values,
      tier_used: "premium"  // Adjust based on user tier
    })
  }

  const renderQuestion = (question: any) => {
    switch (question.question_type) {
      case 'scale':
        return <NumberInput {...form.getInputProps(question.id.toString())} label={question.text} min={1} max={5} />
      case 'boolean':
        return <Checkbox {...form.getInputProps(question.id.toString())} label={question.text} />
      case 'multiple_choice':
        return (
          <Radio.Group {...form.getInputProps(question.id.toString())} label={question.text}>
            {Object.entries(question.options.choices || {}).map(([key, value]) => (
              <Radio key={key} value={key} label={value as string} />
            ))}
          </Radio.Group>
        )
      case 'text':
        return <Textarea {...form.getInputProps(question.id.toString())} label={question.text} />
      default:
        return null
    }
  }

  return (
    <div className="container">
      <Title order={1}>{assessment.name}</Title>
      <Text mb="md">{assessment.description}</Text>
      <Progress value={(progress / totalQuestions) * 100} mb="md" />
      <Text mb="md">Progress: {progress}/{totalQuestions} questions completed</Text>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {assessment.dimensions.map((dim: any) => (
          <Card key={dim.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Title order={3}>{dim.name}</Title>
            <Text size="sm" color="dimmed" mb="sm">{dim.description}</Text>
            
            {dim.questions.map((question: any) => (
              <Group key={question.id} mb="md">
                {renderQuestion(question)}
              </Group>
            ))}
          </Card>
        ))}
        
        <Button type="submit" mt="md">Submit Assessment</Button>
      </form>
    </div>
  )
}

export default AssessmentView