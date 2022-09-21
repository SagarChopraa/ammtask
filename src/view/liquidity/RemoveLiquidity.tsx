import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import styled from "styled-components"
import { Spinner } from "../../logic/Spinner";
import { bustFactoryAddress } from "../../abi/bust";  
import { wbnbAddress } from "../../abi/rest"; // 
import { convertToMin, ethToWei, weiToEth } from "../../logic/conversion";
import {  ToastContainer, toast } from "react-toastify";
import { routerReducer } from "../../logic/reducer/routerReducer";
import { BustRouterAddress } from "../../abi/bustRouterABI";
const BUSTAddress = bustFactoryAddress;
const RESTAddress = wbnbAddress;

export const RemoveLiquidity = () => {
  const [percentage, setPercentage] = useState<any>("25");
  const [loading, setLoading] = useState<any>(false);
  const [bustlp, setBustlp] = useState<any>();
  const [reserve0, setReserve0] = useState<any>();
  const [reserve1, setReserve1] = useState<any>();
  const [tokenA, setTokenA] = useState<any>();
  const [tokenB, setTokenB] = useState<any>();
  const [selectedtokenA, setSelectedTokenA] = useState<any>()
  const [selectedtokenB, setSelectedTokenB] = useState<any>()
  const [selectedLP, setSelectedLP] = useState<any>();
  const [totalSupply, setTotalSupply] = useState<any>();
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { BustPair } = selector;
  const { RouterBust } = selector;
  const removeSuccess = () => toast("Remove Liquidity Successfull");
  const removeFailure = () => toast("Remove Liquidity Failed");
  const approveSuccess = () => toast("Approve LP Token Successfull");
  const approveFailure = () => toast("Approve LP Token Failed");


  useEffect(() => {
    if (percentage === 100) {
      setSelectedLP(bustlp);
      setSelectedTokenA(tokenA);
      setSelectedTokenB(tokenB)
    } else {
      setSelectedLP(Number(bustlp) * (percentage / 100));
      setSelectedTokenB(Number(tokenB) * (percentage / 100));
      setSelectedTokenA(Number(tokenA) * (percentage / 100));
    }
  }, [percentage, selectedLP,loading]);


  // Remove liquidity start

  // Pool token start

  useEffect(() => {
    const getBUSTLP = async () => {
      try {
        const BUSTLP = await BustPair.methods.balanceOf(address).call();
        const finalBUSTLP = Web3.utils.fromWei(BUSTLP);
        setBustlp(parseFloat(finalBUSTLP).toFixed(4));
      } catch (err) {
        console.log(err);
      }
    }

    getBUSTLP();

  }, [BustPair, address, loading]);

  // Pool token end

  // Get Reserve Start

  useEffect(() => {
    const getReserve = async () => {
      try {
        const Reserve = await BustPair.methods.getReserves().call();
        setReserve0(Reserve._reserve0);
        setReserve1(Reserve._reserve1);
      } catch (err) {
        console.log(err);
      }
    }

    getReserve();
  }, [BustPair]);

  // Get Reserve End

  const getTotalSupply = async () => {
    try{
      const total = await BustPair.methods.totalSupply().call();
      const totalFloat = parseFloat(weiToEth(total))
      setTotalSupply(totalFloat)
      const BUST = ( parseFloat(weiToEth(reserve0)) / totalSupply  ) *  parseFloat(bustlp);   
      const REST = ( parseFloat(weiToEth(reserve1)) / totalSupply  ) *  parseFloat(bustlp);
      setTokenA(REST);
      setTokenB(BUST);
    }catch(err){
      console.log(err);
    }
  }

  const approvePair = async () => {
    try {
      const approve = await BustPair.methods.approve(BustRouterAddress, ethToWei(selectedLP)).send({from: address})
      .on("receipt", function () {
        approveSuccess();
      })
      .on("error", function () {
        approveFailure();
      });
    } catch (error) {
      console.log(error);
    }
  }


  const removeLiquidity = async () => {
    try {
      setLoading(true);
      await approvePair();
      const remove = await RouterBust.methods
        .removeLiquidity(
          RESTAddress,
          BUSTAddress,
          ethToWei(selectedLP),
          convertToMin(selectedtokenA),
          convertToMin(selectedtokenB),
          address,
          Date.now() + 900,
        )
        .send({ from: address })
        .on("receipt", function () {
          removeSuccess();
        })
        .on("error", function () {
          removeFailure();
        });
        setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTotalSupply();
  },[tokenA, tokenB, BustPair, totalSupply, loading])

  

  // Remove liquidity end
  return (
      <PoolContainerMain>
        <ToastContainer />
          <FourButtonDiv>
              <PercentageButton onClick={() => setPercentage("25")} percentage={percentage === "25"}>25%</PercentageButton>
              <PercentageButton onClick={() => setPercentage("50")} percentage={percentage === "50"}>50%</PercentageButton>
              <PercentageButton onClick={() => setPercentage("75")} percentage={percentage === "75"}>75%</PercentageButton>
              <PercentageButton onClick={() => setPercentage("100")} percentage={percentage === "100"}>Max</PercentageButton>
          </FourButtonDiv>
          <PoolTokenContainer>
              <PoolTokenHeading>Pooled Tokens</PoolTokenHeading>
              <ValueAndToken>
                  <Value>{bustlp}</Value>
                  <Token>BUST-LP</Token>
              </ValueAndToken>
              <ValueAndToken>
                  <Value>{tokenA}</Value>
                  <Token>REST</Token>
              </ValueAndToken>
              <ValueAndToken>
                  <Value>{tokenB}</Value>
                  <Token>BUST</Token>
              </ValueAndToken>
          </PoolTokenContainer>
          <PoolTokenContainer>
              <PoolTokenHeading>Selected Tokens</PoolTokenHeading>
              <ValueAndToken>
                  <Value>{selectedLP || Number(bustlp) * (25 / 100)}</Value>
                  <Token>BUST-LP</Token>
              </ValueAndToken>
              <ValueAndToken>
                  <Value>{selectedtokenA || Number(tokenA) * (25 / 100)}</Value>
                  <Token>REST</Token>
              </ValueAndToken>
              <ValueAndToken>
                  <Value>{selectedtokenB || Number(tokenB) * (25 / 100)}</Value>
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
              <SwapButton onClick={removeLiquidity}>{loading ? <Spinner/> : "Remove"}</SwapButton>
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
    width: 100%;
    opacity: 0.5;
    cursor: pointer;
    box-shadow: none;
    background-color: rgb(242, 4, 20);
    border: 1px solid rgb(255, 104, 113);
    margin: 10px;
    color: #FFFFFF;
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
    color:  ${(props) =>
		props.percentage
			? `#FFFFFF`
			: "#000000"};;
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