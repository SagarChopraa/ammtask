import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components"
import Web3 from "web3";
import BigNumber from "bignumber.js"
import {BustRouterAddress} from '../../abi/bustRouterABI';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from "../../logic/Spinner";
import { wbnbAddress } from "../../abi/rest"; // REST
import { bustFactoryAddress } from "../../abi/bust";  //BUST
import { weiToEth } from "../../logic/conversion";
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
  const [isApprovedRest, setIsApprovedRest] = useState<boolean>(false);
  const [isApprovedBust, setIsApprovedBust] = useState<boolean>(false);
  const [loading, setLoading] = useState<any>(false);
  const selector = useSelector((state:any) => state);
  const { address } = selector.wallet;
  const { REST } = selector;
  const { BUST } = selector;
  const { BustPair } = selector;
  const { RouterBust } = selector;
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

  const handleMinReceive = (val: any, slippage: number) => {
    const slippageValue = new BigNumber(slippage).dividedBy(100)
    const valueTobeRemoved = new BigNumber(val).multipliedBy(slippageValue)
    const value = new BigNumber(val).minus(valueTobeRemoved)
    return value
  }


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
          setBust(Web3.utils.fromWei(amountB));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get quote end


  // approve start

  const maxAllowance = new BigNumber(2).pow(256).minus(1);

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
  }, [rest, bust]);

  const approveREST = async () => {
    try {
      const approvebusd = await REST.methods.approve(BustRouterAddress, maxAllowance)
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        alert(hash)
      }).on("receipt", (receipt: any) => {
        restSucess();
      }).on("error", (error: any, receipt: any) => {
        restfailed();
      });
    } catch (err) {
      console.log(err);
    }
  }

  const approveBUST = async () => {
    try {
      const approvebust = await BUST.methods.approve(BustRouterAddress, maxAllowance)
      .send({ from: address })
      .on("transactionHash", (hash: any) => {
        alert(hash)
      }).on("receipt", (receipt: any) => {
        bustSuccess();
      }).on("error", (error: any, receipt: any) => {
        bustfailed();
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
        const aMin = handleMinReceive( Web3.utils.toWei(rest), 0.5);
        const bMin = handleMinReceive( Web3.utils.toWei(bust), 0.5);
        console.log("deadline", aMin.toString(), bMin.toString());
        const deadline = Date.now() + 900;
        console.log("deadline end", deadline);
        const addliquidity = await RouterBust.methods
        .addLiquidity(
          RESTAddress, 
          BUSTAddress, 
          Web3.utils.toWei(rest), 
          Web3.utils.toWei(bust), 
          aMin.toFixed(0), 
          bMin.toFixed(0), 
          address, 
          deadline
          )
        .send({ from: address })
        .on("receipt", (receipt: any) => {
          setBust("");
          setRest("");
          success();
        }).on("error", (error: any, receipt: any) => {
          setBust("");
          setRest("");
          failed();
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
    // await approveREST();
    // await approveBUST();        
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
              <InputField placeholder="0.00" value={rest ? rest : ''} onChange={(e) => { setRest(e.target.value); getQuoteBust(e.target.value) }}></InputField>
          </FormInputOne>
          <ArrowSignDiv>
              <ArrowSign></ArrowSign>
          </ArrowSignDiv>
          <FormInputOne>
              <FormInputOneHeading>
                  <HeadingOne>BUST</HeadingOne>
                  <HeadingOne>Balance: {balancebust}</HeadingOne>
              </FormInputOneHeading>
              <InputField placeholder="0.00" value={bust ? bust : ''} onChange={(e) => { setBust(e.target.value); getQuoteRest(e.target.value) }}></InputField>
          </FormInputOne>
          <SlipAndToleDiv>
              <SlippageDiv>Slippage tolerance: 0.5%</SlippageDiv>
              <SlippageDiv>Transaction deadline: 15 min</SlippageDiv>
          </SlipAndToleDiv>
          <BusdAndBustDiv>
              <SlippageDiv>1REST = 2.490698 BUST</SlippageDiv>
              <SlippageDiv>1BUST = {oneRest} REST</SlippageDiv>
          </BusdAndBustDiv>
          <SwapButtonDiv>
              <SwapButton onClick={handleAddLiquidity}>{loading ? <Spinner/> : "Supply"}</SwapButton>
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
`;
