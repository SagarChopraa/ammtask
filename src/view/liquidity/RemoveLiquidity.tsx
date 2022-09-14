import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import styled from "styled-components"

export const RemoveLiquidity = () => {
  const [percentage, setPercentage] = useState("50%");
  const [bustlp, setBustlp] = useState<string>();
  const [bustR, setBustR] = useState<string>();
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { REST } = selector;
  const { BUST } = selector;
  const { BustPair } = selector;
  const { RouterBust } = selector;
  console.log("Rest", REST);



  // Remove liquidity start

  // Pool token start

  useEffect(() => {
    const getBUSTLP = async () => {
      try {
        const BUSTLP = await BustPair.methods.balanceOf(address).call();
        const finalBUSTLP = Web3.utils.fromWei(BUSTLP);
        console.log(finalBUSTLP);
        setBustlp(finalBUSTLP);
      } catch (err) {
        console.log(err);
      }
    }

    getBUSTLP();

  }, [BustPair, address]);

  useEffect(() => {
    const getBUST = async () => {
      try {
        const BUSTR = await BUST.methods.balanceOf(address).call();
        const finalBUSTR = Web3.utils.fromWei(BUSTR);
        console.log(finalBUSTR);
        setBustR(finalBUSTR);
      } catch (err) {
        console.log(err);
      }
    }

    getBUST();

  }, [BUST, address]);

  // Pool token start

  // Remove liquidity end
  return (
      <PoolContainerMain>
          <FourButtonDiv>
              <PercentageButton onClick={() => setPercentage("25%")} percentage={percentage === "25%"}>25%</PercentageButton>
              <PercentageButton onClick={() => setPercentage("50%")} percentage={percentage === "50%"}>50%</PercentageButton>
              <PercentageButton onClick={() => setPercentage("75%")} percentage={percentage === "75%"}>75%</PercentageButton>
              <PercentageButton onClick={() => setPercentage("max")} percentage={percentage === "max"}>Max</PercentageButton>
          </FourButtonDiv>
          <PoolTokenContainer>
              <PoolTokenHeading>Pooled Tokens</PoolTokenHeading>
              <ValueAndToken>
                  <Value>{bustlp}</Value>
                  <Token>BUST-LP</Token>
              </ValueAndToken>
              <ValueAndToken>
                  <Value>balancerest</Value>
                  <Token>REST</Token>
              </ValueAndToken>
              <ValueAndToken>
                  <Value>balancebust</Value>
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
                  <Token>REST</Token>
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
              <SlippageDiv>1REST = 2.490698 BUST</SlippageDiv>
              <SlippageDiv>1BUST = 0.401490 BUSD</SlippageDiv>
          </BusdAndBustDiv>
          <SwapButtonDiv>
              <SwapButton>Remove</SwapButton>
          </SwapButtonDiv>
      </PoolContainerMain>
  )
}

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