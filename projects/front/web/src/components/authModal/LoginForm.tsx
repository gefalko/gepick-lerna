import React, { useCallback } from 'react'
// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import config from 'config'
import { Form, Input, Button, Divider } from 'antd'
import { useMutation } from 'react-apollo-hooks'
import { GraphQLError } from 'graphql'
import getErrorCodes from 'utils/getErrorCodes'
import gql from 'graphql-tag'
import Link from '@gepick/components/link/Link'
import Brandbook from 'components/brandbook/Branbook'
import Container from '@gepick/components/container/Container'
import { getPatreonAuthRedirectUrl } from 'utils/utils'
import { LoginWithEmailMutation, LoginWithEmailMutationVariables } from '../../generatedGraphqlTypes'

const loginWithEmailMutation = gql`
  mutation LoginWithEmailMutation($data: LoginInput!) {
    loginWithEmail(data: $data)
  }
`

enum LoginErrorEnum {
  EMAIL_NOT_EXIST = 'EMAIL_NOT_EXIST',
  PASSWORD_NOT_CORRECT = 'PASSWORD_NOT_CORRECT',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
}

interface ILoginButtonProps {
  text: string
  color: string
  onClick: () => void
}

const LoginButton: React.FunctionComponent<ILoginButtonProps> = (props) => {
  return (
    <Container marginTop={16}>
      <Button
        onClick={props.onClick}
        style={{ width: '100%', backgroundColor: props.color, borderColor: props.color }}
        type="primary"
        htmlType="submit"
      >
        {props.text}
      </Button>
    </Container>
  )
}

interface IFormData {
  email: string
  password: string
}

interface IProps {
  onSignUpLinkClick: () => void
  onResetPasswordLinkClick: () => void
  onClose: () => void
}

const LoginForm: React.FunctionComponent<IProps> = (props) => {
  const [loginWithEmail] = useMutation<LoginWithEmailMutation, LoginWithEmailMutationVariables>(loginWithEmailMutation)
  const [form] = Form.useForm()

  const handleOnEmailLogin = async (formData: IFormData) => {
    const handleErrors = (apolloErrors: readonly GraphQLError[]) => {
      const errors = getErrorCodes(apolloErrors)

      if (errors.includes(LoginErrorEnum.EMAIL_NOT_EXIST)) {
        form.setFields([
          {
            name: 'email',
            errors: ['Email not exist!'],
          },
        ])
      }

      if (errors.includes(LoginErrorEnum.PASSWORD_NOT_CORRECT)) {
        form.setFields([
          {
            name: 'password',
            errors: ['Password is not correct!'],
          },
        ])
      }

      if (errors.includes(LoginErrorEnum.EMAIL_NOT_VERIFIED)) {
        form.setFields([
          {
            name: 'password',
            errors: ['Email not verified!'],
          },
        ])
      }
    }
    const { data, errors } = await loginWithEmail({
      variables: {
        data: {
          email: formData.email,
          password: formData.password,
        },
      },
      errorPolicy: 'all',
    })

    if (data?.loginWithEmail) {
      localStorage.setItem(config.JWT_LOCAL_STORAGE_PATH, data.loginWithEmail)
      props.onClose()
      location.reload()
    }

    if (errors) {
      handleErrors(errors)
    }
  }

  const loginWithPatreon = useCallback(() => {
    const clientId = 'zI9FL12D1bIgrq3f7iZUWGj3SGBe507OWjikW8Ssxhq0kdaCp3FbD2ccdyiTb8GG'
    const rederictUrl = getPatreonAuthRedirectUrl()

    location.replace(
      `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${rederictUrl}`,
    )
  }, [])

  const loginWithFacebook = (response) => {
    console.log('response', response)
  }

  const loginWithGoogle = () => {}

  return (
    <>
      <FacebookLogin
        appId="115918301876928"
        autoLoad
        fields="name,email,picture"
        callback={loginWithFacebook}
        render={(renderProps: { onClick: () => void }) => (
          <LoginButton onClick={renderProps.onClick} color="#4267B2" text="Login with Facebook" />
        )}
      />
      <LoginButton onClick={loginWithGoogle} color="#D93D27" text="Login with Google" />
      <LoginButton onClick={loginWithPatreon} color="#E16151" text="Login with Patreon" />
      <Divider>Or</Divider>
      <Form form={form} name="basic" initialValues={{ remember: true }} onFinish={handleOnEmailLogin}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Container>
            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
              Log in with email
            </Button>
            <Container marginTop={8} justifyContentCenter>
              <Brandbook type="small">
                New to gepick? <Link onClick={props.onSignUpLinkClick}>Sign up</Link>. Forgot password?{' '}
                <Link onClick={props.onResetPasswordLinkClick}>Reset here</Link>.
              </Brandbook>
            </Container>
          </Container>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginForm
