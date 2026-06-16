import { Link } from 'react-router-dom';

import styles from './index.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.containerLista}>
        <h1>Telas do Contax</h1>
        <Link to="/tela/inicial">Tela de Apresentação.</Link>
        <Link to="/tela/login">Tela de Login.</Link>
        <Link to="/tela/menuAdm">Tela de Menu Administrador.</Link>
        <Link to="/tela/menuME">Tela de Menu ME.</Link>
        <Link to="/tela/menuMEvisu">Tela de Menu ME Visualizador.</Link>
        <Link to="/tela/menuMEgeren">Tela de Menu ME Gerente.</Link>
        <Link to="/tela/menuMEI">Tela de Menu MEI.</Link>
      </div>
    </div>
  );
}

export default Home;
