import React, { useState } from 'react'
import { Form, Input, Button, Result } from 'antd'
import Link from '@gepick/components/link/Link'
import Brandbook from 'components/brandbook/Branbook'
import Container from '@gepick/components/container/Container'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import { AskResetPasswordMutation, AskResetPasswordMutationVariables } from '../../generatedGraphqlTypes'

const askResetPasswordMutation = gql`
  mutation AskResetPasswordMutation($email: String!) {
    askResetPassword(email: $email)
  }
`

interface IFormData {
  email: string
}

interface IProps {
  onLoginLinkClick: () => void
  onSignUpLinkClick: () => void
}

const ResetPasswordForm: React.FunctionComponent<IProps> = (props) => {
  const [success, setSuccess] = useState<boolean>()
  const [askPasswordReset] = useMutation<AskResetPasswordMutation, AskResetPasswordMutationVariables>(
    askResetPasswordMutation,
  )

  const handleOnFinish = async (formData: IFormData) => {
    await askPasswordReset({ variables: { email: formData.email } })
    setSuccess(true)
  }

  if (success === true) {
    return (
      <Result
        status="success"
        title="Success"
        subTitle="A password reset link was sent. Click the link in the email to create a new password."
      />
    )
  }

  if (success === false) {
    return <Result status="error" />
  }

  return (
    <Form name="basic" initialValues={{ remember: true }} onFinish={handleOnFinish}>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Container>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            Reset password
          </Button>
          <Container marginTop={8} justifyContentCenter>
            <Brandbook type="small">
              <Link onClick={props.onLoginLinkClick}>Log in</Link> or{' '}
              <Link onClick={props.onSignUpLinkClick}>Sign up</Link> to gepick.
            </Brandbook>
          </Container>
        </Container>
      </Form.Item>
    </Form>
  )
}

export default ResetPasswordForm
