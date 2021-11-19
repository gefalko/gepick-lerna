import React from 'react'
import { Modal, Form, Input } from 'antd'
import { GraphQLError } from 'graphql'
import { useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import getErrorCodes from 'utils/getErrorCodes'
import validateMessages from 'utils/validateMessages'
import { Store } from 'antd/lib/form/interface'
import { LoginWithEmail, LoginWithEmailVariables } from '../../generatedGraphqlTypes'

interface IProps {
  onClose: () => void
  onOk: (token: string) => void
}

export enum LoginErrorEnum {
  EMAIL_NOT_EXIST = 'EMAIL_NOT_EXIST',
  PASSWORD_NOT_CORRECT = 'PASSWORD_NOT_CORRECT',
}

interface IFormData {
  email: string
  password: string
}

const loginWithEmailMutation = gql`
  mutation LoginWithEmail($data: LoginInput!) {
    loginWithEmail(data: $data)
  }
`

const LoginModal: React.FunctionComponent<IProps> = (props) => {
  const [form] = Form.useForm()

  const [login] = useMutation<LoginWithEmail, LoginWithEmailVariables>(loginWithEmailMutation)

  const handleOk = () => {
    form.submit()
  }

  const handleSubmit = async (store: Store) => {
    const formData = store as IFormData
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
    }

    const { data, errors } = await login({
      variables: {
        data: {
          email: formData.email,
          password: formData.password,
        },
      },
      errorPolicy: 'all',
    })

    if (errors) {
      handleErrors(errors)
    }

    if (!errors && data) {
      props.onOk(data.loginWithEmail)
    }
  }

  return (
    <Modal visible onCancel={props.onClose} title="Login to gepick" onOk={handleOk}>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={handleSubmit}
        form={form}
        validateMessages={validateMessages}
      >
        <Form.Item name="email" label="Email address" rules={[{ required: true }, { type: 'email' }]}>
          <Input placeholder="Email address" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default LoginModal
