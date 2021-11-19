import React, { useMemo } from 'react'
import { Modal as AntdModal } from 'antd'
import { ModalProps } from 'antd/lib/modal/index.d'
import './Modal.css'
import useBreakPoints from '../hooks/useBreakPoints'

interface IProps extends ModalProps {
  okButtonDisabled?: boolean
  fullscreen?: boolean
}

const Modal: React.FunctionComponent<IProps> = (props) => {
  const { isMobile } = useBreakPoints()

  const isFullScreen = useMemo(() => {
    if (props.fullscreen !== undefined) {
      return props.fullscreen
    }

    return isMobile
  }, [isMobile, props.fullscreen])

  return (
    <div>
      <AntdModal
        className={isFullScreen ? 'fullscreen' : undefined}
        {...props}
        okButtonProps={{ style: props.okButtonDisabled ? { display: 'none' } : {} }}
      />
    </div>
  )
}

export default Modal
