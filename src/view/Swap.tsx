import Navbar from "./Navbar"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import Web3 from "web3";
import BigNumber from "bignumber.js"
import {BustRouterAddress} from '../abi/bustRouterABI';
import { wbnbAddress } from "../abi/rest"; // REST
import { bustFactoryAddress } from "../abi/bust";  //BUST
const BUSTAddress = bustFactoryAddress;
const RESTAddress = wbnbAddress;

const Swap = () => {
  const [balancerest, setbalancerest] = useState<string>('0.00');
  const [balancebust, setbalancebust] = useState<string>('0.00');
  const [amountIn , setAmountIn] = useState<string>("");
  const [amountOut , setAmountOut] = useState<string>("");
  const [input, setInput] = useState('');
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { REST } = selector;
  const { BUST } = selector;
  const { BustPair } = selector;
  const { RouterBust } = selector;


  useEffect(() => {

    // Get Balance start

    const getBalanceREST = async () => {
      try {
        const Rest = await REST.methods.balanceOf(address).call();
        const FinalRest = weiToEth(Rest);
        setbalancerest(FinalRest);
      }
      catch (err) {
        console.log(err);
      }
    }

    getBalanceREST();


  }, [REST, address])

  useEffect(() => {
    const getBalanceBUST = async () => {
      try {
        const bust = await BUST.methods.balanceOf(address).call();
        const Finalbust = weiToEth(bust);
        setbalancebust(Finalbust);
      }
      catch (err) {
        console.log(err);
      }
    }

    getBalanceBUST();
  }, [BUST, address]);

  // Get Balance end

    const getAmountIn = async (rest: any) => {
      try{
        if(rest === ""){
          setAmountIn("");
        }else{
        const amountIn = await RouterBust.methods
        .getAmountsIn(
          ethToWei(rest), 
          [RESTAddress, BUSTAddress])
          .call();
        console.log("amountIN",amountIn);
        setAmountIn(weiToEth(amountIn[0]));
        }
      }catch (err) {
        console.log(err);
      }
    }

    const getAmountOut = async (bust: any) => {
      try{
        if(bust === ""){
          setAmountOut("");
        }else{
        const amountOut = await RouterBust.methods
        .getAmountsIn(
          ethToWei(bust), 
          [BUSTAddress, RESTAddress])
          .call();
        console.log("amountOut",amountOut);
        setAmountOut(weiToEth(amountOut[0]));
      }
      }catch (err) {
        console.log(err);
      }
    }

    const handleMinReceive = (val: any, slippage: number) => {
      const slippageValue = new BigNumber(slippage).dividedBy(100)
      const valueTobeRemoved = new BigNumber(val).multipliedBy(slippageValue)
      const value = new BigNumber(val).minus(valueTobeRemoved)
      return value
    }

    const swapExactTokensForTokens = async () => {
      try{
        console.log("run");
        const amountOutMin = handleMinReceive( Web3.utils.toWei(amountOut), 0.5);
        const deadline = Date.now() + 900;
        const ExactTokensForTokens = await RouterBust.methods
        .swapExactTokensForTokens(
          ethToWei(amountIn),
          amountOutMin.toFixed(0),
          [RESTAddress, BUSTAddress],
          address,
          deadline
        )
        .send({from: address})
        .on("transactionHash", (hash: any) => {
            alert(hash)
        }).on("receipt", (receipt: any) => {
            alert("swap successfull")
        }).on("error", (error: any, receipt: any) => {
            alert("swap failed")
        });
        }catch(err) {
          console.log(err);
        }
      }

  const weiToEth = (amount: string, decimals: number = 18) => {
    return new BigNumber(amount).dividedBy(10 ** decimals).toFixed()
  }

  const ethToWei = (amount: string, decimals: number = 18) => {
    return new BigNumber(amount).times(10 ** decimals).toFixed()
  }


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
                  <HeadingOne>Balance: {balancerest}</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00" value={amountIn ? amountIn : ''} 
                onChange={(e) => { setAmountIn(e.target.value); getAmountOut(e.target.value); setInput(e.target.value)}}></InputField>
              </FormInputOne>
              <ArrowSignDiv>
                <ArrowSign></ArrowSign>
              </ArrowSignDiv>
              <FormInputOne>
                <FormInputOneHeading>
                  <HeadingOne>BUST</HeadingOne>
                  <HeadingOne>Balance: {balancebust}</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00" value={amountOut ? amountOut : ''} 
                onChange={(e) => { setAmountOut(e.target.value); getAmountIn(e.target.value) }}></InputField>
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
                <SwapButton onClick={swapExactTokensForTokens}>Swap</SwapButton>
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
    background-color: rgb(236, 6, 21);
    border: 1px solid rgb(255, 104, 113);
    margin: 10px;
    color: #FFFFFF;
`;

