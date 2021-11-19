import React from 'react'
import Brandbook from 'components/brandbook/Branbook'
import Container from '@gepick/components/container/Container'
import usePartner from 'hooks/usePartner'

const Partner: React.FunctionComponent<{}> = () => {
  const { partner } = usePartner()

  if (!partner) {
    return null
  }

  return (
    <Container flex>
      <Container marginLeft={5} marginRight={5}>
        <Brandbook color="white">|</Brandbook>
      </Container>
      <Container>
        <Brandbook type="bold" color="yellow">
          {partner.name}
        </Brandbook>
      </Container>
    </Container>
  )
}

export default Partner
