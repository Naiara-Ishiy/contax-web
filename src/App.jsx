import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';

import Inicial from './pages/telas/inicial';
import Login from './pages/telas/login';
import MenuAdm from './pages/telas/menuAdm';
import MenuME from './pages/telas/menuME';
import MenuMEvisu from './pages/telas/menuMEvisu'
import MenuMEgeren from './pages/telas/menuMEgeren'
import MenuMEI from './pages/telas/menuMEI';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tela/inicial" element={<Inicial />} />
      <Route path="/tela/login" element={<Login />} />
      <Route path="/tela/menuAdm" element={<MenuAdm />} />
      <Route path="/tela/menuME" element={<MenuME />} />
      <Route path="/tela/menuMEvisu" element={<MenuMEvisu />} />
      <Route path="/tela/menuMEgeren" element={<MenuMEgeren />} />
      <Route path="/tela/menuMEI" element={<MenuMEI />} />
    </Routes>
  );
}

export default App;
