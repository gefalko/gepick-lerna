import React, { useCallback } from 'react'
import { LinkOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Modal, Button, Input, message } from 'antd'
import Container from '@gepick/components/container/Container'
import styled from 'styled-components'
import useBoolean from '@gepick/components/hooks/useBoolean'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  RedditIcon,
  RedditShareButton,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  VKShareButton,
  VKIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'
import usePartner from 'hooks/usePartner'
import { TrackEvents } from 'services/GoogleAnalytics'

const StyledButtonContainer = styled(Container)`
  border: 1px solid #3498db;
  background: #3498db;
  cursor: pointer;
  border-radius: 9999px;
  padding: 5px 10px;
`

const ShareButton: React.FunctionComponent<{}> = () => {
  const [isModalVisible, openModal, closeModal] = useBoolean()
  const { partner, createPartner } = usePartner()

  const handleClick = useCallback(async () => {
    openModal()

    TrackEvents.valuePicksPage.shareModalOpen()

    if (!partner) {
      TrackEvents.valuePicksPage.newPartnerCreated()
      await createPartner()
    }
  }, [openModal, partner, createPartner])

  const url = `https://gepick.com/value-picks?pid=${partner?.name}`
  const iconSize = 50
  const title = 'gepick - football predictions, value picks'
  const hashtag = '#sportpredictions #bet #betting #bettingtips #bettingtipster'
  const quote = 'Software for bit the bets'

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(url)
    message.success('Copied!')
  }

  return (
    <>
      <StyledButtonContainer onClick={handleClick}>
        <ShareAltOutlined /> Share with friends
      </StyledButtonContainer>

      {isModalVisible && (
        <Modal
          title="Share about gepick with friends"
          visible
          okText="Close"
          cancelButtonProps={{
            style: {
              display: 'none',
            },
          }}
          onCancel={closeModal}
          onOk={closeModal}
        >
          <Container justifyContentCenter>
            <FacebookShareButton quote={quote} hashtag={hashtag} url={url} title={title}>
              <FacebookIcon round size={iconSize} />
            </FacebookShareButton>
            <LinkedinShareButton url={url} title={title}>
              <LinkedinIcon round size={iconSize} />
            </LinkedinShareButton>
            <RedditShareButton url={url} title={title}>
              <RedditIcon round size={iconSize} />
            </RedditShareButton>
            <TelegramShareButton url={url} title={title}>
              <TelegramIcon round size={iconSize} />
            </TelegramShareButton>
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon round size={iconSize} />
            </TwitterShareButton>
            <VKShareButton url={url} title={title}>
              <VKIcon round size={iconSize} />
            </VKShareButton>
            <WhatsappShareButton url={url} title={title}>
              <WhatsappIcon round size={iconSize} />
            </WhatsappShareButton>
          </Container>
          <Container fullWidth marginTop={20}>
            <Input
              size="large"
              addonBefore={<LinkOutlined />}
              addonAfter={
                <Button type="primary" onClick={handleCopyLinkClick}>
                  Copy link
                </Button>
              }
              value={url}
            />
          </Container>
          <Container marginTop={20}>
            <b>Note:</b> Each new vistor give you extra day for use gepick value picks. All sharing data is connected
            with your partner name <b>{partner?.name}</b> and are stored on browser cookies. Have questions? please
            write to <a>help@gepick.com</a>.
          </Container>
        </Modal>
      )}
    </>
  )
}

export default ShareButton
