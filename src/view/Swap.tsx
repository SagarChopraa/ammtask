import Navbar from "./Navbar"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import { ToastContainer, toast } from 'react-toastify';
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import { Spinner } from "../logic/Spinner";
import {BustRouterAddress} from '../abi/bustRouterABI';
import { wbnbAddress } from "../abi/rest"; // REST
import { bustFactoryAddress } from "../abi/bust";  //BUST
import { convertToMax, convertToMin, ethToWei, weiToEth } from "../logic/conversion";
import { useDispatch } from "react-redux";
import { decrementDeadline, incrementDeadline } from "../logic/action/deadline.action";
import { decrementSlippage, incrementSlippage } from "../logic/action/slippage.action";
const BUSTAddress = bustFactoryAddress;
const RESTAddress = wbnbAddress;

const Swap = () => {
  const selector = useSelector((state: any) => state);
  const { RouterBust, REST, BUST, BustPair } = selector;
  const { address } = selector.wallet;
  const [loading, setLoading] = useState<any>(false);
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [initialREST, setInitlalREST] = useState<any>();
  const [initialBust, setInitialBust] = useState<any>();
  const [rustBalance, setRustBalance] = useState("0.00");
  const [bustBalance, setBustBalance] = useState("0.00");
  const [addLiquidityLoading, setAddLiquidityLoading] = useState(false);
  const [amountA, setAmountA] = useState<any>()
  const [amountB, setAmountB] = useState<any>()
  const [type, setType] = useState(0)
  const [swapType, setSwapType] = useState(true)
  const RESTAddress = wbnbAddress;
  const BUSTAddress = bustFactoryAddress;
  const WBNBAddress = '0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F';
  const RestToBust = [RESTAddress, BUSTAddress];
  const BustToRest = [BUSTAddress, RESTAddress];
  const RestToWBNB = [RESTAddress, WBNBAddress];
  const WBNBToRest = [WBNBAddress, RESTAddress];
  const [routerAddress, setRouterAddress] = useState<any>(RestToBust)
  const [isApprovedBust, setIsApprovedBust] = useState(false);
  const [isApprovedRest, setIsApprovedRest] = useState(false);
  const [tokenName, setTokenName] = useState('BUST');

  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  const { slippage, deadline } = selector;
  const dispatch = useDispatch();

  const bustSuccess = () => toast('BUST Approved Successfully');
  const bustfailed = () => toast('BUST Approved Failed');
  const restSucess = () => toast('REST Approved Successfully');
  const restfailed = () => toast('REST Approved Failed');
  const swapSuccess = () => toast('Swap Successfull');
  const swapFailed = () => toast('Swap Failed');

  // get initials

  const getReserve = async () => {
    try {
      const Reserve = await BustPair.methods.getReserves().call();
      setReserve0(Reserve._reserve0);
      setReserve1(Reserve._reserve1);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getReserve();
  }, [BustPair]);

  const getInitials = async () => {
    try {
      getReserve();
      let init = "1";
      if (reserve0 && reserve1) {
        const amountA = await RouterBust.methods
          .quote(ethToWei(init), reserve0, reserve1)
          .call();
        const floatA = parseFloat(weiToEth(amountA));
        setInitlalREST(floatA.toFixed(2));
        const amountB = await RouterBust.methods
          .quote(ethToWei(init), reserve1, reserve0)
          .call();
        const floatB = parseFloat(weiToEth(amountB));
        setInitialBust(floatB.toFixed(2));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInitials();
  }, [RouterBust, reserve0, reserve1]);


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

  const handleInputOne = async (input: any) => {
    if (input) {
      setAmountA(input);
      const result = await RouterBust.methods
        .getAmountsOut(ethToWei(input, 18), tokenName === 'WBNB' ?( swapType === true ? RestToWBNB : WBNBToRest )   : routerAddress)
        .call();
      setAmountB(weiToEth(result[1], 18));
      setType(1);
    } else {
      setAmountA("");
      setAmountB("");
    }
  };

  const maxAllowance = new BigNumber(2).pow(128).minus(1);

  const approveREST = async () => {
    try {
      setLoading(true);
      const approvebusd = await REST.methods.approve(BustRouterAddress, ethToWei(maxAllowance.toString()))
      .send({ from: address })
      .on("receipt", (receipt: any) => {
        restSucess();
        setIsApprovedRest(true);
        setLoading(false);
      }).on("error", (error: any, receipt: any) => {
        restfailed();
        setIsApprovedRest(false);
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }


  const approveBUST = async () => {
    try {
      setLoading(true);
      const approvebust = await BUST.methods.approve(BustRouterAddress, ethToWei(maxAllowance.toString()))
      .send({ from: address })
      .on("receipt", (receipt: any) => {
        bustSuccess();
        setIsApprovedBust(true);
        setLoading(false);
      }).on("error", (error: any, receipt: any) => {
        bustfailed();
        setIsApprovedBust(false);
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const getAllowances = async (rest: any = "", bust: any = "") => {
    try {
      const allowanceA = await REST.methods
        .allowance(address, BustRouterAddress)
        .call();
      const allowanceB = await BUST.methods
        .allowance(address, BustRouterAddress)
        .call();
      if (rest !== "") {
        if (parseFloat(weiToEth(allowanceA, 18)) > parseFloat(rest)) {
          setIsApprovedRest(true);
        } else {
          setIsApprovedRest(false);
        }
      }
      if (bust !== "") {
        if (parseFloat(weiToEth(allowanceB, 18)) > parseFloat(bust)) {
          setIsApprovedBust(true);
        } else {
          setIsApprovedBust(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (swapType === true) {
      getAllowances(amountA, amountB);
    } else {
      getAllowances(amountB, amountB);
    }
  }, [amountA, amountB]);

  const handleInputTwo = async (input: any) => { 
    if (input) {
      setAmountB(input);
      const result = await RouterBust.methods
        .getAmountsIn(ethToWei(input, 18), tokenName === 'WBNB' ? ( swapType === true ? RestToWBNB : WBNBToRest )   : routerAddress)
        .call();
      setAmountA(weiToEth(result[0], 18));
      setType(2);
    } else {
      setAmountA("");
      setAmountB("");
    } 
  };

  const swapExactTokensForTokens = async () => {
    try{
      setLoading(true);
      const amountOutMin = convertToMin(amountB, slippage);
      const ExactTokensForTokens = await RouterBust.methods
      .swapExactTokensForTokens(
        ethToWei(amountA, 18),
        amountOutMin,
        routerAddress, //RestToBust
        address,
        Date.now() + (deadline * 60)
      )
      .send({from: address})
      .on("receipt", (receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapSuccess();
          setLoading(false);
      }).on("error", (error: any, receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapFailed();
          setLoading(false);
      });
      setLoading(false);
      }catch(err) {
        console.log(err);
        setLoading(false);
    }
  }

  const swapTokensForExactTokens = async () => {
    try{
      setLoading(true);
      const amountInMax = convertToMax(amountA, slippage);
      const ExactTokensForTokens = await RouterBust.methods
      .swapTokensForExactTokens(
        ethToWei(amountB, 18),
        amountInMax,
        routerAddress, //RestToBust
        address,
        Date.now() + (deadline * 60)
      )
      .send({from: address})
      .on("receipt", (receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapSuccess();
          setLoading(false);
      }).on("error", (error: any, receipt: any) => {
          setAmountA("");
          setAmountB("");
          swapFailed();
          setLoading(false);
      });
      setLoading(false);
      }catch(err) {
        console.log(err);
        setLoading(false);
    }
  }

  const swapExactTokensForETH = async () =>{
    setLoading(true);
    try {
      const amountOutMin = convertToMin(amountB, slippage);
      const dl = Date.now() + ( deadline * 60 );
      const ExactTokensForTokens = await RouterBust.methods
        .swapExactTokensForETH(
          ethToWei(amountA),
          amountOutMin,
          RestToWBNB,
          address,
          dl
        )
        .send({ from: address })
        .on("receipt", (receipt: any) => {
          swapSuccess();
          setLoading(false);
          setAmountA("");
          setAmountB("");
        })
        .on("error", (error: any, receipt: any) => {
          swapFailed();
          setLoading(false);
          setAmountA("");
          setAmountB("");
        });
    } catch (err) {
      console.log(err);
    }
  }

  const swapExactETHForTokens = async () => {
    setLoading(true);
    try {
      const amountOutMin = convertToMin(amountB, slippage);
      const dl = Date.now() + ( deadline * 60 );
      const ExactTokensForTokens = await RouterBust.methods
        .swapExactETHForTokens(
          amountOutMin,
          WBNBToRest,
          address,
          dl
        )
        .send({ from: address, value: ethToWei(amountA) })
        .on("receipt", (receipt: any) => {
          swapSuccess();
          setLoading(false);
          setAmountA("");
          setAmountB("");
        })
        .on("error", (error: any, receipt: any) => {
          swapFailed();
          setLoading(false);
          setAmountA("");
          setAmountB("");
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };


  const swapETHForExactTokens = async () => {
    setLoading(true);
    try {
      const amountOutMin = convertToMin(amountB, slippage);
      const dl = Date.now() + ( deadline * 60 );
      const ExactTokensForTokens = await RouterBust.methods
        .swapETHForExactTokens(
          amountOutMin,
          WBNBToRest,
          address,
          dl
        )
        .send({ from: address, value: ethToWei(amountA) })
        .on("receipt", (receipt: any) => {
          swapSuccess();
          setLoading(false);
          setAmountA("");
          setAmountB("");
        })
        .on("error", (error: any, receipt: any) => {
          swapFailed();
          setLoading(false);
          setAmountA("");
          setAmountB("");
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  
  const handleSwap = () => {
    setLoading(true);
    if (type === 1) {
      if(tokenName === 'WBNB' ){
        if(swapType === true){
          swapExactTokensForETH()
        }else{
          swapExactETHForTokens()
        }
      }else{
        swapExactTokensForTokens();
      }
    } else {
      if(tokenName === 'WBNB' ){
        if(swapType === true){
          swapExactTokensForETH()
        } else{
          swapETHForExactTokens();
        }
      }else{
        swapTokensForExactTokens();
      }
    }
  };

  useEffect(() => {
    getTokenBalance();
  }, [REST, BUST, address, addLiquidityLoading, loading]);


  const handleDropdownChange = (value: any) => {
    setTokenName(value)
    setAmountA("");
    setAmountB("")
  }
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
                  {swapType && <HeadingOne>REST</HeadingOne>}
                  {/* <HeadingOne>{swapType === true ? "REST" : "BUST"}</HeadingOne> */}
                  {!swapType === true &&
                  <select onChange={(e) => handleDropdownChange(e.target.value)} value={tokenName}  className="select">
                  <option value="BUST">
                    BUST
                  </option>
                  <option value="WBNB">
                    WBNB
                  </option>
                  </select>
                }
                  <HeadingOne>Balance:{swapType === true? parseFloat(rustBalance).toFixed(2): parseFloat(bustBalance).toFixed(2) }</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00" value={amountA} onChange={(e) => handleInputOne(e.target.value)}></InputField>
              </FormInputOne>
              <ArrowSignDiv onClick ={() => handleChangeRouter()}>
                <ArrowSign></ArrowSign>
              </ArrowSignDiv>
              <FormInputOne>
                <FormInputOneHeading>
                {!swapType && <HeadingOne>REST</HeadingOne>}
                  {swapType === true &&
                  <select onChange={(e) => handleDropdownChange(e.target.value)} value={tokenName} className="select"> 
                  <option value="BUST">
                    BUST
                  </option>
                  <option value="WBNB">
                    WBNB
                  </option>
                  </select>
                }
                  <HeadingOne>Balance: {swapType === true? parseFloat(bustBalance).toFixed(2) : parseFloat(rustBalance).toFixed(2)}</HeadingOne>
                </FormInputOneHeading>
                <InputField placeholder="0.00" value={amountB} onChange={(e) => handleInputTwo(e.target.value)}></InputField>
              </FormInputOne>
              <SlipAndToleDiv>
                <SlippageDiv>Slippage tolerance:
                  <ValueButton onClick={() => dispatch(decrementSlippage())} disabled={ slippage <= 0.2 }>-</ValueButton> 
                  {slippage.toFixed(1)} %  {" "}
                  <ValueButton onClick={() => dispatch(incrementSlippage())} disabled={ slippage >= 2 }>+</ValueButton>
                </SlippageDiv>
                <SlippageDiv>Transaction deadline: 
                  <ValueButton onClick={() => dispatch(decrementDeadline())} disabled={deadline<=15}>-</ValueButton> 
                  {deadline} min {"  "}
                  <ValueButton onClick={() => dispatch(incrementDeadline())} disabled={deadline>=60}>+</ValueButton>
                </SlippageDiv>
              </SlipAndToleDiv>
              <BusdAndBustDiv>
                <SlippageDiv>1REST = {initialBust} BUST</SlippageDiv>
                <SlippageDiv>1BUST = {initialREST} REST</SlippageDiv>
              </BusdAndBustDiv>
              <SwapButtonDiv>
              {(!isApprovedRest || !isApprovedBust) && <SwapButton onClick={()=>{approveREST();approveBUST();}} disabled={!amountA}>{loading ? <Spinner/> : "Approve"}</SwapButton>}
                <SwapButton onClick={() => handleSwap()} disabled={!(parseFloat(rustBalance) > parseFloat(amountA)) ||
                !(parseFloat(bustBalance) > parseFloat(amountB)) || !isApprovedBust && !isApprovedRest}>{loading ? <Spinner/> : "Swap"}</SwapButton>
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

    .select{
      border: none;
      outline: none;
      background-color: rgb(255, 249, 240);
    }
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
  margin-top: 10px;
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

    :disabled{
      cursor: not-allowed;
      opacity: 0.3;
  }
`;

const ValueButton = styled.button`
  font-size: 20px;
  border: none;
  margin: 0px 12px;
  cursor: pointer;
  opacity: 0.5;
  padding: 4px 12px;
  border-radius: 8px;
  color: #FFFFFF;
  background-color: rgb(244, 0, 16);

  :disabled{
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

