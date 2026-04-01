import { Link } from 'react-router-dom';

import styles from './index.module.css';

function Home() {

  return (
    <div className={styles.container}>
      <div className={styles.containerLista}>
        <h1>Telas do Contax</h1>
        <Link to="/tela/inicial">Tela de Apresentação.</Link>
      </div>
    </div>
  )
}

export default Home
