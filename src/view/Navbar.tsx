import { useState, useEffect } from "react";
import styled from 'styled-components';
import { Link as LinkR } from "react-router-dom";
import Web3 from "web3";
import { BustRouterAddress, BustRouterABI } from "../abi/bustRouterABI";
import { BustPairAddress, BustPairABI } from "../abi/bustPairABI";
import { wbnbAddress, wbnbABI } from "../abi/rest";
import { bustFactoryAddress, bustFactoryABI } from "../abi/bust";
import {useDispatch, useSelector} from "react-redux";
import {setrouterabi} from '../logic/action/routerabi.action';
import {setBustPairabi} from '../logic/action/bustpairabi.action';
import {setwbnbabi} from '../logic/action/wbnbabi.action';
import {setBustFactoryabi} from '../logic/action/bustfactoryabi';
import {connectEthWallet, disconnectEthWallet} from '../logic/action/wallet.action';
import { useWeb3React } from "@web3-react/core"
import {injected} from '../logic/connectors/walletConnectors';

declare let window: any;

const Navbar = () => {
  const dispatch = useDispatch();
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  const connect = async () =>{
    try{
      await activate(injected);
      localStorage.setItem('isWalletConnected', "true")
    }catch(err){
      dispatch(disconnectEthWallet());
      console.log(err);
    }
  }

  async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', "false")
      dispatch(disconnectEthWallet());
      dispatch(setrouterabi(""));
      dispatch(setBustPairabi(""));
      dispatch(setwbnbabi(""));
      dispatch(setBustFactoryabi(""));
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad =  async () => {
      if(localStorage?.getItem('isWalletConnected') === 'true'){
        try{
          await activate(injected)
          localStorage.setItem('isWalletConnected', "true")
        }catch(err){
          console.log(err);
        }
      }
    }
    connectWalletOnPageLoad();
  }, [])

  useEffect(() => {
  const targetNetworkId = '0x61';
  const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      if (currentChainId == targetNetworkId) {
        if(library && account) {
          dispatch(connectEthWallet(account));
          const contract = new library.eth.Contract(BustRouterABI, BustRouterAddress);
          const contract2 = new library.eth.Contract(BustPairABI, BustPairAddress);
          const contract3 = new library.eth.Contract(wbnbABI, wbnbAddress);
          const contract4 = new library.eth.Contract(bustFactoryABI, bustFactoryAddress);
          dispatch(setrouterabi(contract));
          dispatch(setBustPairabi(contract2));
          dispatch(setwbnbabi(contract3));
          dispatch(setBustFactoryabi(contract4));
        }
      }else{
        const switchNetwork = async () => {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetworkId }],
          });
          window.location.reload();
        };
        switchNetwork();
      }
    }
  };
  checkNetwork();
  }, [library, account])

 



  return (
    <>
    <NavbarContainerMain> 
      <NavbarContainer>
        <NavbarInternal>
          <LogoDiv>
            <Logo></Logo>
            <LogoName>AnotherSwap</LogoName>
          </LogoDiv>
          <LinkDivMain>
            <LinkR to="/"><Link>Dashboard</Link></LinkR>
            <LinkR to="/swap"><Link>Exchange</Link></LinkR>
            <LinkR to="/liquidity"><Link>Liquidity</Link></LinkR>
            {
              active?
                <>
                  <Link onClick={disconnect}>{"Disconnect Wallet"}</Link>
                  <Link>{account?.slice(0,4)+ "..." +  account?.slice(-4,)}</Link>
                </>
              :
                <Link onClick={connect}>{active ? account?.slice(0,4)+ "..." +  account?.slice(-4,): "connect"}</Link>
            }
          </LinkDivMain>
        </NavbarInternal>
      </NavbarContainer>
    </NavbarContainerMain>

    </>
  )
}

export default Navbar

const NavbarContainer = styled.div`
    padding: 15px 10px;
    position: sticky;
    top: 0px;
    backdrop-filter: blur(8px);
    background: rgba(9, 34, 39, 0.5)
`;

const NavbarContainerMain = styled.div`
  display: flex;
    flex-direction: column;
    align-self: center;
    width: calc(100% - 2 * var(--pageMargin));
    max-width: 1280px;
    margin: 0px auto;
    min-height: auto;
    padding: 50px 0px 100px;
    transition: all 300ms ease-in-out 0s;
`;

const NavbarInternal = styled.div`
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    flex-flow: row wrap;
`;

const LogoDiv = styled.div`
  height: 65px;
  display: flex;
  flex-direction: row;
`;

const Logo = styled.div`
  background-image: url("https://www.bakeryswap.org/static/media/logo.4e93c681.svg");
  width: 100px;
  background-repeat: no-repeat;
  background-size: 70%;
`;

const LogoName = styled.div`
  height: inherit;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color: #831212;
  font-weight: bolder;
  font-size: xxx-large;
`;

const LinkDivMain = styled.div`
    display: flex; 
    -webkit-box-align: center;
    align-items: center;
`;

const Link = styled.div`
    position: relative;
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
    color: rgb(255, 255, 255);
    padding: 20px;
    margin: 0px 5px;
    border: 2px solid rgb(69, 87, 87);
    transition: all 0.5s linear 0s;

    :hover{
      color: rgb(255, 255, 255);
      opacity: 0.8;
      box-shadow: rgb(235, 218, 134) 5px 5px;
    }
`;