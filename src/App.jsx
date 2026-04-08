import { Routes, Route} from 'react-router-dom';

import Home from './pages/home';

import Inicial from './pages/telas/inicial';
import Login from './pages/telas/login';



function App() {

  return (
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tela/inicial' element={<Inicial/>}/>
        <Route path='/tela/login' element={<Login/>}/>
      </Routes>
    
  )
}

export default App;
