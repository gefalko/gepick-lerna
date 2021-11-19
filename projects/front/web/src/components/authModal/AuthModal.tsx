import React from 'react'
import Modal from '@gepick/components/modal/Modal'
import Container from '@gepick/components/container/Container'
import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import LoginForm from './LoginForm'
import SignUpForm from './SignupForm'
import ResetPasswordForm from './ResetPasswordForm'
import EmailVerification from './EmailVerification'
import ResetPasswordFormStep2 from './ResetPasswordFormStep2'
import { AuthModalState, AUTH_MODAL_URL_KEY } from './utils'

const AuthModal: React.FunctionComponent<{}> = () => {
  const [state, setState] = useUrlParamState(AUTH_MODAL_URL_KEY)

  const openLoginForm = () => {
    setState(AuthModalState.LOGIN)
  }

  const close = () => {
    setState(null)
  }

  const openSignUpForm = () => {
    setState(AuthModalState.SIGNUP)
  }

  const openPasswordResetForm = () => {
    setState(AuthModalState.PASSWORD_RESET)
  }

  const getModalTitle = () => {
    switch (state) {
      case AuthModalState.LOGIN:
        return 'Log in'
      case AuthModalState.SIGNUP:
        return 'Sign up'
      case AuthModalState.PASSWORD_RESET:
        return 'Password reset'
      case AuthModalState.EMAIL_VERIFICATION:
        return 'Email verification'
      case AuthModalState.RESET_PASSWORD_STEP_2:
        return 'Reset password'
      default:
        return undefined
    }
  }

  return (
    <Modal title={getModalTitle()} onCancel={close} footer={null} visible={state != null}>
      <Container justifyContentCenter>
        <Container width={320}>
          {state === AuthModalState.LOGIN && (
            <LoginForm
              onClose={close}
              onResetPasswordLinkClick={openPasswordResetForm}
              onSignUpLinkClick={openSignUpForm}
            />
          )}
          {state === AuthModalState.SIGNUP && <SignUpForm onLoginLinkClick={openLoginForm} />}
          {state === AuthModalState.PASSWORD_RESET && (
            <ResetPasswordForm onLoginLinkClick={openLoginForm} onSignUpLinkClick={openSignUpForm} />
          )}
          {state === AuthModalState.EMAIL_VERIFICATION && <EmailVerification onLoginClick={openLoginForm} />}
          {state === AuthModalState.RESET_PASSWORD_STEP_2 && <ResetPasswordFormStep2 onLoginClick={openLoginForm} />}
        </Container>
      </Container>
    </Modal>
  )
}

export default AuthModal
