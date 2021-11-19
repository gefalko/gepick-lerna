import React, { useState } from 'react'
import Modal from '@gepick/components/modal/Modal'
import { Form, Input, Alert } from 'antd'
import Container from '@gepick/components/container/Container'

export interface IFormData {
  dockerImage: string
  description?: string
  gitRepositoryLink?: string
}

interface IBot {
  botId: string
  dockerImage: string
}

interface ISubmitResponse {
  error?: string
  bot?: IBot
}

interface IProps {
  authorized: boolean
  onClose: () => void
  onSubmit: (data: IFormData) => Promise<ISubmitResponse>
}

const processingMsg = <span>We pulling your image, please wait few minutes ...</span>

const PushBotModal: React.FunctionComponent<IProps> = (props) => {
  const [form] = Form.useForm()
  const [error, setError] = useState<string | undefined>()
  const [processing, setProcessing] = useState<boolean>(false)
  const [botData, setBotData] = useState<IBot>()

  const handleSubmit = async (data: IFormData) => {
    setProcessing(true)
    const res = await props.onSubmit(data)

    if (res.error) {
      setError(res.error)
    }

    if (error) {
      setError(undefined)
    }

    if (res.bot) {
      setBotData(res.bot)
    }

    setProcessing(false)
  }

  return (
    <Modal
      title="Push bot to gepick"
      maskClosable={false}
      visible
      okButtonDisabled={!props.authorized || botData !== undefined}
      onOk={form.submit}
      okText="Submit"
      cancelText="Close"
      onCancel={props.onClose}
    >
      {botData && (
        <Container marginBottom={20}>
          <Alert
            message="Your bot deployed successfuly."
            description={`Now our cronjobs will calculate daily predictions using your bot (${botData.dockerImage}).`}
            type="success"
            showIcon
          />
        </Container>
      )}
      {error && !processing && (
        <Container marginBottom={20}>
          <Alert message="Error" description={error} type="error" showIcon />
        </Container>
      )}
      {processing && (
        <Container marginBottom={20}>
          <Alert message={processingMsg} type="info" />
        </Container>
      )}
      {props.authorized && !botData && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Bot docker image"
            name="dockerImage"
            rules={[{ required: true, message: 'Docker image is required' }]}
          >
            <Input placeholder="Bot docker image" />
          </Form.Item>
          <Form.Item label="Bot source code Git repository" name="gitRepository">
            <Input placeholder="Bot source code Git repository" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
        </Form>
      )}

      {!props.authorized && <Container>Please login for push pick.</Container>}
    </Modal>
  )
}

export default PushBotModal
