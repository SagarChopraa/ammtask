import { useState, useEffect } from "react";
import Navbar from "./Navbar"
import styled from "styled-components"
import { useSelector } from "react-redux";
import Web3 from "web3";
import {BustRouterAddress} from '../abi/bustRouterABI';
import { wbnbAddress } from "../abi/wbnbABI"; // BUSD
import { bustFactoryAddress } from "../abi/bustFactoryABI";  //BUST
const BUSTAddress = bustFactoryAddress;
const BUSDAddress = wbnbAddress;

const Liquidity = () => {
  const [active, setActive] = useState("add");
  const [percentage, setPercentage] = useState("50%");
  const [busd, setBusd] = useState<string>('');
  const [bust, setBust] = useState<string>('');
  const [balancebusd, setbalancebusd] = useState<string>('0.00');
  const [balancebust, setbalancebust] = useState<string>('0.00');
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [amount1, setAmount1] = useState();
  const [bustlp, setBustlp] = useState<string>();
  const [bustR, setBustR] = useState<string>();
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { BUSD } = selector;
  const { BUST } = selector;
  const { BustPair } = selector;
  const { RouterBust } = selector;
  console.log(bust);

  useEffect(() => {

    // Get Balance start
    
      const getBalanceBUSD = async() => {
        try{
          const busd = await BUSD.methods.balanceOf(address).call();
          const Finalbusd = Web3.utils.fromWei(busd);
          setbalancebusd(Finalbusd);
        }
          catch(err){
          console.log(err);
        }
      }

      getBalanceBUSD();

 
  },[BUSD, address])

  useEffect(() => {
    const getBalanceBUST = async() => {
      try{
        const bust = await BUST.methods.balanceOf(address).call();
        const Finalbust = Web3.utils.fromWei(bust);
        console.log(Finalbust);
        setbalancebust(Finalbust);
      }
        catch(err){
        console.log(err);
      }
    }

    getBalanceBUST();
  },[BUST, address]);

  // Get Balance end


  // Get Reserve Start

  useEffect(() => {
    const getReserve = async() => {
      try{
        const Reserve = await BustPair.methods.getReserves().call();
        setReserve0(Reserve._reserve0);
        setReserve1(Reserve._reserve1);
      }catch(err){
        console.log(err);
      }
    }

    getReserve();
  },[BustPair]);

  // Get Reserve End

  // Get Quote start

  const getQuoteBusd = async() => {
    try{
      // const bust1 = 888;
      // const bustWei = bust.Web3.utils.toWei();
      if(bust === ""){
        console.log("bust is empty");
      }else{
        const amountA = await RouterBust.methods.quote(bust, reserve1, reserve0).call();
        const slippage = amountA * 0.5 / 100;
        console.log(amountA);
        console.log(slippage);
        const sixDecimal = Web3.utils.toWei(amountA);
        console.log(sixDecimal);
        console.log(amountA);
        setBusd(amountA);
      }
    }catch(err){
      console.log(err);
    }
}

  // getQuote();
  // },[bust, reserve0, reserve1, RouterBust]);

  // useEffect(() => {
    const getQuoteBust = async() => {
        try{
          // const busd1 = 888;
          const amountB = await RouterBust.methods.quote(busd, reserve0, reserve1).call();
          console.log("kjhgv", amountB);
          setBust(amountB);
        }catch(err){
          console.log(err);
        }
    }

  // getQuote1();

  // useEffect(() => {
      // },[busd, reserve0, reserve1]);

  // Get Quote End

  

  // useEffect(() => {
  //  console.log(bust);
  //  console.log(busd);

  //   if(bust){
  //     getQuoteBusd();
  //   }else if(busd){
  //     getQuoteBust();
  //   }else{
      
  //   }
  // },[bust, busd]);

  // if(busd){
  //   getQuote1();
  // }

  // Approve start

  const approveBUSD = async() =>{
    try{
      // const approve = await BUSD.methods.approve("0xBEDa4Ea077766b43092397B0AE7D53bC999561eB", "6").send({from: "0x4190a5c11594C063063c509D9B68d97F55c81076"});
      const approvebusd = await BUSD.methods.approve(BustRouterAddress, busd).send({from: address});
      // console.log(busd);
      // console.log(approvebusd);
    }catch(err){
      console.log(err);
    }
  }

  const approveBUST = async() => {
    try{
      const approvebust = await BUST.methods.approve(BustRouterAddress, bust).send({from: address});
      console.log(approvebust);
    }catch(err){
      console.log(err);
    }
  }

  

  // approveBUSD();

  // Approve End


  // ADD liquidity start

  const addLiquidity = async() => {
    try{
      const addliquidity = await RouterBust.methods.addLiquidity(BUSDAddress, BUSTAddress, 5, 5, 4, 4, address, 15 ).send({from: address});
      console.log(addliquidity);
    }catch(err){
      console.log(err);
    }
  }

  // addLiquidity();

  // ADD liquidity end

  function threeInOne() {
    approveBUSD();
    approveBUST();
    addLiquidity()
  }



  // Remove liquidity start

  // Pool token start

  useEffect(() => {
    const getBUSTLP = async() =>{
      try{
        const BUSTLP = await BustPair.methods.balanceOf(address).call();
        const finalBUSTLP = Web3.utils.fromWei(BUSTLP);
        console.log(finalBUSTLP);
        setBustlp(finalBUSTLP);
      }catch(err){
        console.log(err);
      }
    }

    getBUSTLP();

  },[BustPair, address]);

  useEffect(() => {
    const getBUST = async() =>{
      try{
        const BUSTR = await BUST.methods.balanceOf(address).call();
        const finalBUSTR = Web3.utils.fromWei(BUSTR);
        console.log(finalBUSTR);
        setBustR(finalBUSTR);
      }catch(err){
        console.log(err);
      }
    }

    getBUST();

  },[BUST, address]);

  // Pool token start

  // Remove liquidity end

 

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
                    <HeadingOne>Balance: {balancebusd}</HeadingOne>
                  </FormInputOneHeading>
                  <InputField placeholder="0.00" value={busd ? busd : ''} onChange={(e) => {setBusd(e.target.value); getQuoteBust()}}></InputField>
                </FormInputOne>
                <ArrowSignDiv>
                  <ArrowSign></ArrowSign>
                </ArrowSignDiv>
                <FormInputOne>
                  <FormInputOneHeading>
                    <HeadingOne>BUST</HeadingOne>
                    <HeadingOne>Balance: {balancebust}</HeadingOne>
                  </FormInputOneHeading>
                  <InputField placeholder="0.00" value={bust ? bust : ''} onChange={(e) => {setBust(e.target.value); getQuoteBusd()}}></InputField>
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
                  <SwapButton onClick={threeInOne}>Supply</SwapButton>
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
                      <Value>{bustlp}</Value>
                      <Token>BUST-LP</Token>
                    </ValueAndToken>
                    <ValueAndToken>
                      <Value>{balancebusd}</Value>
                      <Token>BUSD</Token>
                    </ValueAndToken>
                    <ValueAndToken>
                      <Value>{balancebust}</Value>
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
