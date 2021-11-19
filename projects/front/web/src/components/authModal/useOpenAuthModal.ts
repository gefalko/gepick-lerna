import useUrlParamState from '@gepick/components/hooks/useUrlParamState'
import { AuthModalState, AUTH_MODAL_URL_KEY } from './utils'

function useOpenAuthModal(): () => void {
  const [, setState] = useUrlParamState(AUTH_MODAL_URL_KEY)

  const open = () => {
    setState(AuthModalState.LOGIN)
  }

  return open
}

export default useOpenAuthModal
