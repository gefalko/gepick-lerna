import React, { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Form, Input, Button, Checkbox, Result } from 'antd'
import { GraphQLError } from 'graphql'
import getErrorCodes from 'utils/getErrorCodes'
import Link from '@gepick/components/link/Link'
import Brandbook from 'components/brandbook/Branbook'
import Container from '@gepick/components/container/Container'
import { RegistrationWithEmailMutation, RegistrationWithEmailMutationVariables } from '../../generatedGraphqlTypes'

const registrationWithEmailMutation = gql`
  mutation RegistrationWithEmailMutation($payload: RegistrationInput!) {
    registrationWithEmail(data: $payload)
  }
`

interface IFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
  newsletter?: boolean
}

enum RegistrationErrorEnum {
  EMAIL_EXIST = 'EMAIL_EXIST',
  USER_EXIST = 'USER_EXIST',
}

interface IProps {
  onLoginLinkClick: () => void
}

const SignUpForm: React.FunctionComponent<IProps> = (props) => {
  const [successEmail, setSuccessEmail] = useState<string>()
  const [form] = Form.useForm()

  const [register] = useMutation<RegistrationWithEmailMutation, RegistrationWithEmailMutationVariables>(
    registrationWithEmailMutation,
  )

  const handleSubmit = async (formData: IFormData) => {
    const handleErrors = (apolloErrors: readonly GraphQLError[]) => {
      const errors = getErrorCodes(apolloErrors)

      if (errors.includes(RegistrationErrorEnum.USER_EXIST)) {
        form.setFields([
          {
            name: 'username',
            errors: ['Username already exist!'],
          },
        ])
      }

      if (errors.includes(RegistrationErrorEnum.EMAIL_EXIST)) {
        form.setFields([
          {
            name: 'email',
            errors: ['Email already exist!'],
          },
        ])
      }
    }

    const { errors } = await register({
      variables: {
        payload: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          newsletter: formData.newsletter ?? false,
        },
      },
      errorPolicy: 'all',
    })

    if (errors) {
      handleErrors(errors)
    } else {
      setSuccessEmail(formData.email)
    }
  }

  if (successEmail) {
    return (
      <Result
        status="success"
        title="Success"
        subTitle="To activate your account check your email and confirm your registration."
        extra={[<Button type="primary">Resend verification email</Button>]}
      />
    )
  }

  return (
    <Form form={form} name="basic" initialValues={{ remember: true }} onFinish={handleSubmit}>
      <Form.Item name="username" rules={[{ required: true, message: 'Please input username!' }]}>
        <Input placeholder="User name" />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be minimum 6 characters.' },
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('The passwords do not match!'))
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm password" />
      </Form.Item>
      <Form.Item name="newsletter" valuePropName="checked">
        <Checkbox>Subscribe to gepick newsletter</Checkbox>
      </Form.Item>
      <Form.Item>
        <Container>
          <Button style={{ width: '100%' }} type="primary" htmlType="submit">
            Sign up to gepick
          </Button>
          <Container marginTop={8} justifyContentCenter>
            <Brandbook type="small">
              Already on gepick? <Link onClick={props.onLoginLinkClick}>Log in</Link>.
            </Brandbook>
          </Container>
        </Container>
      </Form.Item>
    </Form>
  )
}

export default SignUpForm
