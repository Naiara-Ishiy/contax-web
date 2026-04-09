import { Routes, Route} from 'react-router-dom';

import Home from './pages/home';

import Inicial from './pages/telas/inicial';
import Login from './pages/telas/login';
import MenuAdm from './pages/telas/menuAdm';
import MenuME from './pages/telas/menuME';


function App() {

  return (
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tela/inicial' element={<Inicial/>}/>
        <Route path='/tela/login' element={<Login/>}/>
        <Route path='/tela/menuAdm' element={<MenuAdm/>}/>
        <Route path='/tela/menuME' element={<MenuME/>}/>
      </Routes>
    
  )
}

export default App;
