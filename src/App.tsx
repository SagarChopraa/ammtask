import './App.css';
import Liquidity from './view/liquidity/Liquidity';
import Swap from './view/Swap';
import Home from './view/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function App() {
  function getLibrary(provider: any) {
    return new Web3(provider)
  }
  
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/liquidity' element={<Liquidity />}/>
        <Route path='/swap' element={<Swap />}/>
      </Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  );
}

export default App;
