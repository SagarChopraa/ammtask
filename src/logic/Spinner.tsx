import { ImSpinner2 } from 'react-icons/im'
import { CSSProperties } from 'react'
import styled, { keyframes } from 'styled-components'
interface I_Spinner {
  fontSize?: string
  className?: string
  style?: CSSProperties
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`
export const StyledSpinner = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
`

export const Spinner = ({ fontSize, className, style }: I_Spinner) => {
  return (
    <StyledSpinner className={className} style={style}>
      <ImSpinner2
        color='white'
      />
    </StyledSpinner>
  )
}