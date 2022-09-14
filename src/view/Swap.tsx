import styled from "styled-components"
import Navbar from "./Navbar"

const Swap = () => {
  return (
    <>
      <Navbar />
      <SwapContainerMain>
        <SwapOuterDiv>
          <SwapInterDiv>
            <SwapHeadingDiv>
              <SwapHeading>Swap</SwapHeading>
            </SwapHeadingDiv>
            <FormContainerMain>
              <FormInputOne>
                <FormInputOneHeading>
                  <HeadingOne>REST</HeadingOne>
                  <HeadingOne>Balance: 0.0000</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00"></InputField>
              </FormInputOne>
              <ArrowSignDiv>
                <ArrowSign></ArrowSign>
              </ArrowSignDiv>
              <FormInputOne>
                <FormInputOneHeading>
                  <HeadingOne>BUST</HeadingOne>
                  <HeadingOne>Balance: 0.0000</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00"></InputField>
              </FormInputOne>
              <SlipAndToleDiv>
                <SlippageDiv>Slippage tolerance: 0.5%</SlippageDiv>
                <SlippageDiv>Transaction deadline: 15 min</SlippageDiv>
              </SlipAndToleDiv>
              <BusdAndBustDiv>
                <SlippageDiv>1REST = 2.490698 BUST</SlippageDiv>
                <SlippageDiv>1BUST = 0.401490 REST</SlippageDiv>
              </BusdAndBustDiv>
              <SwapButtonDiv>
                <SwapButton>Swap</SwapButton>
              </SwapButtonDiv>
            </FormContainerMain>
          </SwapInterDiv>
        </SwapOuterDiv>
      </SwapContainerMain>
    </>
  )
}

export default Swap

const SwapContainerMain = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
`;

const SwapOuterDiv = styled.div`
    max-width: 420px;
    width: 100%;
    background: rgb(255, 253, 250);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 20px;
    padding: 1rem;
    margin: 40px 0px;
`;

const SwapInterDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const SwapHeadingDiv = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-box-pack: center;
    justify-content: center;
`;

const SwapHeading = styled.div`
    background: orange;
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 10px;
    padding: 0.5rem;
    margin: 0px 10px;
    cursor: pointer;
    font-family: NunitoSans;
`;

const FormContainerMain = styled.div`

`;

const FormInputOne = styled.div`
    padding: 10px;
    border-radius: 20px;
    background-color: rgb(255, 249, 240);
    margin: 10px;
`;

const FormInputOneHeading = styled.div`
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
`; 

const HeadingOne = styled.p`
  font-size: 16px;
  color: black;
`;

const InputField = styled.input`
    width: 100%;
    outline: none;
    border: none;
    background-color: rgb(255, 249, 240);
`;

const ArrowSignDiv = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
`; 

const ArrowSign = styled.div`
  background-image: url("https://anmfmt.web.app/static/media/arrow.167534cd.svg");
  background-repeat: no-repeat;
  height: 16px;
  width: 16px;
`;

const SlipAndToleDiv = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
`;

const SlippageDiv = styled.div`
  font-size: 15px;
`; 

const BusdAndBustDiv = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
`;

const SwapButtonDiv = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
`;

const SwapButton = styled.button`
    padding: 10px;
    border-radius: 20px;
    opacity: 0.5;
    cursor: pointer;
    box-shadow: none;
    background-color: rgb(255, 104, 113);
    border: 1px solid rgb(255, 104, 113);
    margin: 10px;
`;

