import Navbar from "./Navbar"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import { ToastContainer, toast } from 'react-toastify';
import Web3 from "web3";
import BigNumber from "bignumber.js"
import { Spinner } from "../logic/Spinner";
import {BustRouterAddress} from '../abi/bustRouterABI';
import { wbnbAddress } from "../abi/rest"; // REST
import { bustFactoryAddress } from "../abi/bust";  //BUST
import { convertToMax, convertToMin, ethToWei, weiToEth } from "../logic/conversion";
const BUSTAddress = bustFactoryAddress;
const RESTAddress = wbnbAddress;

const Swap = () => {
  const selector = useSelector((state: any) => state);
  const { RouterBust, REST, BUST, BustPair } = selector;
  const { address } = selector.wallet;
  const [loading, setLoading] = useState<any>(false);
  const [rustBalance, setRustBalance] = useState("0.00");
  const [bustBalance, setBustBalance] = useState("0.00");
  const [addLiquidityLoading, setAddLiquidityLoading] = useState(false);
  const [amountA, setAmountA] = useState<any>()
  const [amountB, setAmountB] = useState<any>()
  const [type, setType] = useState(0)
  const [swapType, setSwapType] = useState(true)
  const RESTAddress = wbnbAddress;
  const BUSTAddress = bustFactoryAddress;
  const RestToBust = [RESTAddress, BUSTAddress];
  const BustToRest = [BUSTAddress, RESTAddress];
  const [routerAddress, setRouterAddress] = useState<any>(RestToBust)
  const bustSuccess = () => toast('BUST Approved Successfully');
  const bustfailed = () => toast('BUST Approved Failed');
  const restSucess = () => toast('REST Approved Successfully');
  const restfailed = () => toast('REST Approved Failed');
  const swapSuccess = () => toast('Swap Successfull');
  const swapFailed = () => toast('Swap Failed');
  /** function to get balance of tokens */
    const getTokenBalance = async () => {
      try {
        const Rest = await REST.methods.balanceOf(address).call();
        setRustBalance(weiToEth(Rest, 18));
        const bust = await BUST.methods.balanceOf(address).call();
        setBustBalance(weiToEth(bust, 18));
      } catch (err) {
        console.log(err);
      }
    };
  
  const handleChangeRouter = () => {
    setSwapType(!swapType)
    if(!swapType){
    setRouterAddress(RestToBust)
    } else {
      setRouterAddress(BustToRest)
    }
  }

  const handleInputOne = async (input:any) =>{
    setAmountA(input);
    const result = await RouterBust.methods
    .getAmountsOut(ethToWei(input, 18),routerAddress ) //RestToBust
    .call();
    setAmountB(weiToEth(result[1],18))
    setType(1)
  }

  const approveREST = async () => {
    try {
      const approvebusd = await REST.methods.approve(BustRouterAddress, Web3.utils.toWei(amountA))
      .send({ from: address })
      .on("receipt", (receipt: any) => {
        restSucess();
      }).on("error", (error: any, receipt: any) => {
        restfailed();
      });
    } catch (err) {
      console.log(err);
    }
  }

  const maxAllowance = new BigNumber(2).pow(256).minus(1);

  const approveBUST = async () => {
    try {
      const approvebust = await BUST.methods.approve(BustRouterAddress, maxAllowance)
      .send({ from: address })
      .on("receipt", (receipt: any) => {
        bustSuccess();
      }).on("error", (error: any, receipt: any) => {
        bustfailed();
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleInputTwo = async (input:any) =>{
    setAmountB(input);
    const result = await RouterBust.methods
    .getAmountsIn(ethToWei(input, 18),routerAddress ) //RestToBust
    .call();
    setAmountA(weiToEth(result[0],18))
    setType(2)
  }

  const swapExactTokensForTokens = async () => {
    try{
      setLoading(true);
      const amountOutMin = convertToMin(amountB);
      const deadline = Date.now() + 900;
      const ExactTokensForTokens = await RouterBust.methods
      .swapExactTokensForTokens(
        ethToWei(amountA, 18),
        amountOutMin,
        routerAddress, //RestToBust
        address,
        deadline
      )
      .send({from: address})
      .on("receipt", (receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapSuccess();
      }).on("error", (error: any, receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapFailed();
      });
      setLoading(false);
      }catch(err) {
        console.log(err);
    }
  }

  const swapTokensForExactTokens = async () => {
    try{
      setLoading(true);
      const amountInMax = convertToMax(amountA);
      const deadline = Date.now() + 900;
      const ExactTokensForTokens = await RouterBust.methods
      .swapTokensForExactTokens(
        ethToWei(amountB, 18),
        amountInMax,
        routerAddress, //RestToBust
        address,
        deadline
      )
      .send({from: address})
      .on("receipt", (receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapSuccess();
      }).on("error", (error: any, receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapFailed();
      });
      setLoading(false);
      }catch(err) {
        console.log(err);
    }
  }
  const handleSwap = () =>{
    if(type === 1){
      swapExactTokensForTokens()
    } else {
      swapTokensForExactTokens()
    }
  }

  useEffect(() => {
    getTokenBalance();
  }, [REST, BUST, address, addLiquidityLoading, loading]);
  return (
    <>
      <ToastContainer />
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
                  <HeadingOne>{swapType === true? 'REST' :'BUST'} </HeadingOne>
                  <HeadingOne>Balance:{swapType === true? parseFloat(rustBalance).toFixed(2): parseFloat(bustBalance).toFixed(2) }</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00" value={amountA} onChange={(e) => handleInputOne(e.target.value)}></InputField>
              </FormInputOne>
              <ArrowSignDiv onClick ={() => handleChangeRouter() }>
                <ArrowSign></ArrowSign>
              </ArrowSignDiv>
              <FormInputOne>
                <FormInputOneHeading>
                  <HeadingOne>{swapType === true? 'BUST' :'REST'}</HeadingOne>
                  <HeadingOne>Balance: {swapType === true? parseFloat(bustBalance).toFixed(2) : parseFloat(rustBalance).toFixed(2)}</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00" value={amountB} onChange={(e) => handleInputTwo(e.target.value)}></InputField>
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
                <SwapButton onClick={() => handleSwap()}>{loading ? <Spinner/> : "Swap"}</SwapButton>
              </SwapButtonDiv>
            </FormContainerMain>
          </SwapInterDiv>
        </SwapOuterDiv>
      </SwapContainerMain>
    </>
  );
};



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
    width: 100%;
    box-shadow: none;
    background-color: rgb(236, 6, 21);
    border: 1px solid rgb(255, 104, 113);
    margin: 10px;
    color: #FFFFFF;
`;

