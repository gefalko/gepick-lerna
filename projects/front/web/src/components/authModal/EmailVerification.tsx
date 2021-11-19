import React, { useEffect, useState } from 'react'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import gql from 'graphql-tag'
import { Result, Button } from 'antd'
import { useMutation } from 'react-apollo-hooks'
import { VerifyEmailMutation, VerifyEmailMutationVariables } from '../../generatedGraphqlTypes'

const verifyEmailMutation = gql`
  mutation VerifyEmailMutation($token: String!) {
    verifyEmail(token: $token)
  }
`

interface IProps {
  onLoginClick: () => void
}

const EmailVerification: React.FunctionComponent<IProps> = (props) => {
  const [verified, setVerified] = useState<boolean>()
  const [token] = useUrlParamState('verifyEmailToken')
  const [verifyEmail] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(verifyEmailMutation)

  useEffect(() => {
    const asyncFunc = async () => {
      if (token) {
        try {
          await verifyEmail({ variables: { token } })
          setVerified(true)
        } catch (err) {
          setVerified(false)
        }
      }
    }

    asyncFunc()
    // eslint-disable-next-line
  }, [])

  if (verified === undefined) {
    return null
  }

  if (!verified) {
    return <Result status="error" title="Failed" subTitle="Email verification failed" />
  }

  return (
    <Result
      status="success"
      title="Success"
      subTitle="You account has been activated."
      extra={[
        <Button onClick={props.onLoginClick} type="primary">
          Login
        </Button>,
      ]}
    />
  )
}

export default EmailVerification
