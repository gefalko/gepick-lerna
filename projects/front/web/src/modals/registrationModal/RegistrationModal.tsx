import React from 'react'
import { Modal, Form, Input, Checkbox } from 'antd'
import gql from 'graphql-tag'
import { GraphQLError } from 'graphql'
import { useMutation } from 'react-apollo-hooks'
import getErrorCodes from 'utils/getErrorCodes'
import validateMessages from 'utils/validateMessages'
import { RegistrationWithEmail, RegistrationWithEmailVariables } from '../../generatedGraphqlTypes'

export enum RegistrationErrorEnum {
  EMAIL_EXIST = 'EMAIL_EXIST',
  USER_EXIST = 'USER_EXIST',
}

interface IProps {
  onClose: () => void
  onOk: (token: string) => void
}

interface IFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
  newsletter?: boolean
}

const registrationWithEmailMutation = gql`
  mutation RegistrationWithEmail($payload: RegistrationInput!) {
    registrationWithEmail(data: $payload)
  }
`

const RegistrationModal: React.FunctionComponent<IProps> = (props) => {
  const [form] = Form.useForm()

  const [register] = useMutation<RegistrationWithEmail, RegistrationWithEmailVariables>(registrationWithEmailMutation)

  const handleOk = () => {
    form.submit()
  }

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

    const { data, errors } = await register({
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
    }

    if (!errors && data) {
      props.onOk(data.registrationWithEmail)
    }
  }

  const tailFormItemLayout = {
    wrapperCol: {
      span: 16,
      offset: 8,
    },
  }

  return (
    <Modal visible onCancel={props.onClose} title="Register to gepick" okText="Register" onOk={handleOk}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        onFinish={handleSubmit}
        validateMessages={validateMessages}
      >
        <Form.Item name="email" label="Email address" rules={[{ required: true }, { type: 'email' }]}>
          <Input placeholder="Email address" />
        </Form.Item>
        <Form.Item name="username" label="User name" rules={[{ required: true }]}>
          <Input placeholder="User name" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm password"
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
        <Form.Item name="newsletter" valuePropName="checked" {...tailFormItemLayout}>
          <Checkbox>Subscribe to gepick newsletter</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RegistrationModal
