import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components"
import Web3 from "web3";
import BigNumber from "bignumber.js"
import {BustRouterAddress} from '../../abi/bustRouterABI';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from "../../logic/Spinner";
import { wbnbAddress } from "../../abi/rest"; // REST
import { bustFactoryAddress } from "../../abi/bust";  //BUST
import { convertToMin, ethToWei, weiToEth } from "../../logic/conversion";
import { decrementDeadline, incrementDeadline } from "../../logic/action/deadline.action";
import { decrementSlippage, incrementSlippage } from "../../logic/action/slippage.action";
const BUSTAddress = bustFactoryAddress;
const RESTAddress = wbnbAddress;

const AddLiquidity = () => {
  const [rest, setRest] = useState<string>('');
  const [oneRest, setOneRest] = useState<string>('');
  const [bust, setBust] = useState<string>('');
  const [balancerest, setbalancerest] = useState<string>('0.00');
  const [balancebust, setbalancebust] = useState<string>('0.00');
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [initialREST, setInitlalREST] = useState<any>();
  const [initialBust, setInitialBust] = useState<any>();
  const [isApprovedRest, setIsApprovedRest] = useState<boolean>(false);
  const [isApprovedBust, setIsApprovedBust] = useState<boolean>(false);
  const [loading, setLoading] = useState<any>(false);
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { REST } = selector;
  const { BUST } = selector;
  const { BustPair } = selector;
  const { RouterBust } = selector;

  const { slippage, deadline } = selector;
  const dispatch = useDispatch();
  
  const success = () => toast('Liquidity Add Successfull');
  const failed = () => toast('Liquidity Add Failed');
  const bustSuccess = () => toast('BUST Approved Successfully');
  const bustfailed = () => toast('BUST Approved Failed');
  const restSucess = () => toast('REST Approved Successfully');
  const restfailed = () => toast('REST Approved Failed');

  useEffect(() => {

    // Get Balance start

    const getBalanceREST = async () => {
      try {
        const Rest = await REST.methods.balanceOf(address).call();
        const FinalRest = Web3.utils.fromWei(Rest);
        setbalancerest(parseFloat(FinalRest).toFixed(2));
      }
      catch (err) {
        console.log(err);
      }
    }

    getBalanceREST();


  }, [REST, address, loading])

  useEffect(() => {
    const getBalanceBUST = async () => {
      try {
        const bust = await BUST.methods.balanceOf(address).call();
        const Finalbust = Web3.utils.fromWei(bust);
        setbalancebust(parseFloat(Finalbust).toFixed(2));
      }
      catch (err) {
        console.log(err);
      }
    }

    getBalanceBUST();
  }, [BUST, address, loading]);

  // Get Balance end


  // Get Reserve Start

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

  // Get Reserve End

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

  // Get Quote start
  useEffect(() => {
    const getQuoteOneRest = async () => {
      try {
          const amountA = await RouterBust.methods
            .quote(1, reserve1, reserve0)
            .call();
            setOneRest(Web3.utils.fromWei(amountA));
      } catch (err) {
        console.log(err);
      }
    };
  }, [])

  const getQuoteRest = async (bust: any) => {
    try {
      if (bust === "") {
        setRest("");
      } else {
        const amountA = await RouterBust.methods
          .quote(Web3.utils.toWei(bust), reserve0, reserve1)
          .call();
          setRest(Web3.utils.fromWei(amountA));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getQuoteBust = async (rest: any) => {
    try {
      if (rest === "") {
        setBust("");
      } else {
        const amountB = await RouterBust.methods
          .quote(Web3.utils.toWei(rest), reserve1, reserve0)
          .call();
          setBust(parseFloat(Web3.utils.fromWei(amountB)).toFixed(2));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get quote end


  // approve start

  const maxAllowance = new BigNumber(2).pow(128).minus(1);

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
    getAllowances(rest, bust);
  }, [rest, bust, loading]);

  const approveREST = async () => {
    try {
      setLoading(true);
      const approvebusd = await REST.methods.approve(BustRouterAddress, ethToWei(maxAllowance.toString()))
      .send({ from: address })
      .on("receipt", (receipt: any) => {
        restSucess();
        setLoading(false);
      }).on("error", (error: any, receipt: any) => {
        restfailed();
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }

  const approveBUST = async () => {
    try {
      setLoading(true);
      const approvebust = await BUST.methods.approve(BustRouterAddress, ethToWei(maxAllowance.toString()))
      .send({ from: address })
      .on("receipt", (receipt: any) => {
        bustSuccess();
        setLoading(false);
      }).on("error", (error: any, receipt: any) => {
        bustfailed();
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Approve End


  // ADD liquidity start

  const addLiquidity = async () => {
    try {
        setLoading(true);
        if(isApprovedRest && isApprovedBust){
        console.log("addliquidity", rest, bust);
        const aMin = convertToMin( rest, slippage);
        const bMin = convertToMin( bust, slippage);
        console.log("deadline", aMin.toString(), bMin.toString());
        console.log("deadline end", deadline);
        const addliquidity = await RouterBust.methods
        .addLiquidity(
          RESTAddress, 
          BUSTAddress, 
          Web3.utils.toWei(rest), 
          Web3.utils.toWei(bust), 
          aMin, 
          bMin, 
          address, 
          Date.now() + (deadline * 60)
          )
        .send({ from: address })
        .on("receipt", (receipt: any) => {
          setBust("");
          setRest("");
          success();
          setLoading(false);
        }).on("error", (error: any, receipt: any) => {
          setBust("");
          setRest("");
          failed();
          setLoading(false);
        });
        }else{
          await approveREST();
          await approveBUST();   
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
  }


  // ADD liquidity end

 const handleAddLiquidity= async () => {    
    await addLiquidity()
  }

  return (
      <FormContainerMain>
        <ToastContainer />
          <FormInputOne>
              <FormInputOneHeading>
                  <HeadingOne>REST</HeadingOne>
                  <HeadingOne>Balance: {balancerest}</HeadingOne>
              </FormInputOneHeading>
              <InputField placeholder="0.00" maxLength={18} value={rest ? rest : ''} onChange={(e) => { setRest(e.target.value); getQuoteBust(e.target.value) }}></InputField>
          </FormInputOne>
          <ArrowSignDiv>
              <ArrowSign></ArrowSign>
          </ArrowSignDiv>
          <FormInputOne>
              <FormInputOneHeading>
                  <HeadingOne>BUST</HeadingOne>
                  <HeadingOne>Balance: {balancebust}</HeadingOne>
              </FormInputOneHeading>
              <InputField placeholder="0.00" maxLength={18} value={bust ? bust : ''} onChange={(e) => { setBust(e.target.value); getQuoteRest(e.target.value) }}></InputField>
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
          {rest && !isApprovedRest && <SwapButton onClick={approveREST} disabled={isApprovedRest}>{loading ? <Spinner/> : "Approve REST"}</SwapButton>}
          {bust && !isApprovedBust && <SwapButton onClick={approveBUST} disabled={isApprovedBust}>{loading ? <Spinner/> : "Approve BUST"}</SwapButton>}
              <SwapButton onClick={handleAddLiquidity} disabled={!(parseFloat(balancerest) > parseFloat(rest)) ||
                !(parseFloat(balancebust) > parseFloat(bust)) || !(isApprovedBust) || !(isApprovedRest)}>
                {loading ? <Spinner/> : "Supply"}
              </SwapButton>
          </SwapButtonDiv>
      </FormContainerMain>
  )
}

export default AddLiquidity


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
    width: 100%;
    cursor: pointer;
    box-shadow: none;
    color: #FFFFFF;
    background-color: rgb(244, 0, 16);
    border: 1px solid rgb(255, 104, 113);
    margin: 10px;

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
