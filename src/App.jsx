import { Routes, Route} from 'react-router-dom';

import Home from './pages/home';

import Inicial from './pages/telas/inicial';



function App() {

  return (
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/tela/inicial' element={<Inicial/>}/>
      </Routes>
    
  )
}

export default App;
