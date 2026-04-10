import { Link } from 'react-router-dom';

import styles from './index.module.css';

function Home() {

  return (
    <div className={styles.container}>
      <div className={styles.containerLista}>
        <h1>Telas do Contax</h1>
        <Link to="/tela/inicial">Tela de Apresentação.</Link>
        <Link to="/tela/login">Tela de Login.</Link>
        <Link to="/tela/menuAdm">Tela de menu Administrador.</Link>
        <Link to="/tela/menuME">Tela de menu ME.</Link>
        <Link to="/tela/menuMEI">Tela de menu MEI.</Link>
      </div>
    </div>
  )
}

export default Home;
