import React, { useState } from 'react'
import { Form, Input, Button, Result } from 'antd'
import Container from '@gepick/components/container/Container'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { ResetPasswordMutation, ResetPasswordMutationVariables } from '../../generatedGraphqlTypes'

const resetPasswordMutation = gql`
  mutation ResetPasswordMutation($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`

interface IFormData {
  newPassword: string
  confirmNewPassword: string
}

interface IProps {
  onLoginClick: () => void
}

const ResetPasswordFormStep2: React.FunctionComponent<IProps> = (props) => {
  const [success, setSuccess] = useState<boolean>()
  const [token] = useUrlParamState('resetPasswordToken')
  const [resetPassword] = useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(resetPasswordMutation)

  const handleOnFinish = async (formData: IFormData) => {
    if (token) {
      await resetPassword({ variables: { token, newPassword: formData.newPassword } })
      setSuccess(true)
    }
  }

  if (success === true) {
    return (
      <Result
        status="success"
        title="Success"
        subTitle="Password has been successfully changed"
        extra={[
          <Button type="primary" onClick={props.onLoginClick}>
            Login
          </Button>,
        ]}
      />
    )
  }

  if (success === false) {
    return <Result status="error" />
  }

  return (
    <Form name="basic" initialValues={{ remember: true }} onFinish={handleOnFinish}>
      <Form.Item name="newPassword" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password placeholder="New password" />
      </Form.Item>
      <Form.Item name="confirmNewPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
        <Input.Password placeholder="Confirm new Password" />
      </Form.Item>
      <Form.Item>
        <Container>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            Reset password
          </Button>
        </Container>
      </Form.Item>
    </Form>
  )
}

export default ResetPasswordFormStep2
