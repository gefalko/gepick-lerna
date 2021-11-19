import React from 'react'
import CommingSoonSrc from '@gepick/assets/images/coming_soon.png'
import Container from '../container/Container'
import Image from '../image/Image'

const CommingSoon: React.FunctionComponent<{}> = () => {
  return (
    <Container justifyContentCenter>
      <Image src={CommingSoonSrc} alt="Coming soon" />
    </Container>
  )
}

export default CommingSoon
