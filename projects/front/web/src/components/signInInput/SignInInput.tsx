import React, { useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Container from '@gepick/components/container/Container'

const StyledContainer = styled.div`
  .flag-dropdown {
    height: 35px;
    top: 10px;
  }

  .react-tel-input .form-control {
    width: 200px;
  }

  .react-tel-input {
    width: auto;
  }
`

const SignInInput: React.FunctionComponent<{}> = () => {
  const [phone, setPhone] = useState<string>()

  return (
    <StyledContainer>
      <Container flex justifyContentSpaceBetween alignItemsCenter>
        <PhoneInput enableSearch value={phone} onChange={setPhone} />
        <Button type="primary">Signin</Button>
      </Container>
    </StyledContainer>
  )
}

export default SignInInput
