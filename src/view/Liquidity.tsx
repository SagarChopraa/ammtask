import { useState, useEffect } from "react";
import Navbar from "./Navbar"
import styled from "styled-components"
import { useSelector } from "react-redux";
import Web3 from "web3";
import {BustRouterAddress} from '../abi/bustRouterABI';
import { wbnbAddress } from "../abi/busd"; // BUSD
import { bustFactoryAddress } from "../abi/bust";  //BUST
const BUSTAddress = bustFactoryAddress;
const BUSDAddress = wbnbAddress;

const Liquidity = () => {
  const [active, setActive] = useState("add");
  const [percentage, setPercentage] = useState("50%");
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { BUSD } = selector;
  const { BUST } = selector;
  const { BustPair } = selector;
  const { RouterBust } = selector;
  console.log("Busd", BUSD);
  console.log("BUST", BUST);
  console.log("Bust-pair", BustPair);
  console.log("RouterBust", RouterBust);

  return (
    <>
      <Navbar />
      <LiquidityContainerMain>
        <LiquidityOuterDiv>
          <LiquidityInterDiv>
            <HeadingButtonDiv>
              <AddHeading onClick={() => setActive("add")} active={active === "add"}>ADD</AddHeading>
              <RemoveHeading onClick={() => setActive("remove")} active={active === "remove"}>Remove</RemoveHeading>
            </HeadingButtonDiv>

            {active === "add" && (
              <FormContainerMain>
                <FormInputOne>
                  <FormInputOneHeading>
                    <HeadingOne>BUSD</HeadingOne>
                    <HeadingOne>Balance: 0</HeadingOne>
                  </FormInputOneHeading>
                  <InputField placeholder="0.00" value="0"></InputField>
                </FormInputOne>
                <ArrowSignDiv>
                  <ArrowSign></ArrowSign>
                </ArrowSignDiv>
                <FormInputOne>
                  <FormInputOneHeading>
                    <HeadingOne>BUST</HeadingOne>
                    <HeadingOne>Balance: 0</HeadingOne>
                  </FormInputOneHeading>
                  <InputField placeholder="0.00" value="0" ></InputField>
                </FormInputOne>
                <SlipAndToleDiv>
                  <SlippageDiv>Slippage tolerance: 0.5%</SlippageDiv>
                  <SlippageDiv>Transaction deadline: 15 min</SlippageDiv>
                </SlipAndToleDiv>
                <BusdAndBustDiv>
                  <SlippageDiv>1BUSD = 2.490698 BUST</SlippageDiv>
                  <SlippageDiv>1BUST = 0.401490 BUSD</SlippageDiv>
                </BusdAndBustDiv>
                <SwapButtonDiv>
                  <SwapButton>Supply</SwapButton>
                </SwapButtonDiv>
              </FormContainerMain>
            )}

            {active === "remove" && (
              <>
                <PoolContainerMain>
                  <FourButtonDiv>
                    <PercentageButton onClick={() => setPercentage("25%")} percentage={percentage==="25%"}>25%</PercentageButton>
                    <PercentageButton onClick={() => setPercentage("50%")} percentage={percentage==="50%"}>50%</PercentageButton>
                    <PercentageButton onClick={() => setPercentage("75%")} percentage={percentage==="75%"}>75%</PercentageButton>
                    <PercentageButton onClick={() => setPercentage("max")} percentage={percentage==="max"}>Max</PercentageButton>
                  </FourButtonDiv>
                  <PoolTokenContainer>
                    <PoolTokenHeading>Pooled Tokens</PoolTokenHeading>
                    <ValueAndToken>
                      <Value>0.0000</Value>
                      <Token>BUST-LP</Token>
                    </ValueAndToken>
                    <ValueAndToken>
                      <Value>0.0000</Value>
                      <Token>BUSD</Token>
                    </ValueAndToken>
                    <ValueAndToken>
                      <Value>0.0000</Value>
                      <Token>BUST</Token>
                    </ValueAndToken>
                  </PoolTokenContainer>
                  <PoolTokenContainer>
                    <PoolTokenHeading>Selected Tokens</PoolTokenHeading>
                    <ValueAndToken>
                      <Value>0.0000</Value>
                      <Token>BUST-LP</Token>
                    </ValueAndToken>
                    <ValueAndToken>
                      <Value>0.0000</Value>
                      <Token>BUSD</Token>
                    </ValueAndToken>
                    <ValueAndToken>
                      <Value>0.0000</Value>
                      <Token>BUST</Token>
                    </ValueAndToken>
                  </PoolTokenContainer>
                  <SlipAndToleDiv>
                  <SlippageDiv>Slippage tolerance: 0.5%</SlippageDiv>
                  <SlippageDiv>Transaction deadline: 15 min</SlippageDiv>
                </SlipAndToleDiv>
                <BusdAndBustDiv>
                  <SlippageDiv>1BUSD = 2.490698 BUST</SlippageDiv>
                  <SlippageDiv>1BUST = 0.401490 BUSD</SlippageDiv>
                </BusdAndBustDiv>
                <SwapButtonDiv>
                  <SwapButton>Remove</SwapButton>
                </SwapButtonDiv>
                </PoolContainerMain>
              </>
            )}

          </LiquidityInterDiv>
        </LiquidityOuterDiv>
      </LiquidityContainerMain>
    </>
  )
}

export default Liquidity;

const LiquidityContainerMain = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
`;

const LiquidityOuterDiv = styled.div`
    max-width: 420px;
    width: 100%;
    background: rgb(255, 253, 250);
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 20px;
    padding: 1rem;
    margin: 40px 0px;
`;

const LiquidityInterDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const HeadingButtonDiv = styled.div`
    display: flex;
    flex-direction: row;
    -webkit-box-pack: center;
    justify-content: center;
`;

const AddHeading = styled.div<{ active: boolean }>`
    background: ${(props) =>
		props.active
			? `orange`
			: "grey"};
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 10px;
    padding: 0.5rem;
    margin: 0px 10px;
    cursor: pointer;
`;

const RemoveHeading = styled.div<{ active: boolean }>`
    background: ${(props) =>
		props.active
			? `orange`
			: "grey"};
    box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 4%) 0px 4px 8px, rgb(0 0 0 / 4%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
    border-radius: 10px;
    padding: 0.5rem;
    margin: 0px 10px;
    cursor: pointer;
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
  background-image: url("https://anmfmt.web.app/static/media/pls.0e4ed426.svg");
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

const PoolContainerMain = styled.div`

`;

const FourButtonDiv = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 10px;
`;

const PercentageButton = styled.div<{percentage:boolean}>`
    margin: 5px;
    padding: 5px 10px;
    border: 1px solid rgb(238, 217, 204);
    background: ${(props) =>
		props.percentage
			? `rgb(114, 47, 13)`
			: "grey"};
    border-radius: 10px;
    cursor: pointer;
`;

const PoolTokenContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const PoolTokenHeading = styled.div`
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    color: rebeccapurple;
`;

const ValueAndToken = styled.div`
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
`;

const Value = styled.span`
  font-size: 16px;
`;

const Token = styled.span`
  font-size: 16px;
`;
