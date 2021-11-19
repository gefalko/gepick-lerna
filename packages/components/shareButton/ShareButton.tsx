import React, { useCallback } from 'react'
import { Modal } from 'antd'
import Container from '@gepick/components/container/Container'
import styled from 'styled-components'
import { ShareAltOutlined } from '@ant-design/icons'
import useBoolean from '../hooks/useBoolean'

const StyledButtonContainer = styled(Container)`
  border: 1px solid #3498db;
  background: #3498db;
  cursor: pointer;
  border-radius: 9999px;
  padding: 5px 10px;
`

const ShareButton: React.FunctionComponent<{}> = () => {
  const [isModalVisible, openModal, closeModal] = useBoolean()

  const handleClick = useCallback(() => {
    openModal()
  }, [openModal])

  return (
    <>
      <StyledButtonContainer onClick={handleClick}>
        <ShareAltOutlined /> Share with friends
      </StyledButtonContainer>

      {isModalVisible && (
        <Modal title="Share about gepick with frends" visible onCancel={closeModal} onOk={closeModal}>
          <Container>Each new vistor give you extra day for use gepick value picks.</Container>
        </Modal>
      )}
    </>
  )
}

export default ShareButton
