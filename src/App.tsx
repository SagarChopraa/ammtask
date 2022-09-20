import './App.css';
import Liquidity from './view/liquidity/Liquidity';
import Swap from './view/Swap';
import Home from './view/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/liquidity' element={<Liquidity />}/>
      <Route path='/swap' element={<Swap />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
