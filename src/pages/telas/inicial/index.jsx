
import styles from './index.module.css';

function Inicial() {

  return (
    <div className={styles.container}>
      <header className={styles.header}>
       <div className={styles.logoArea}>
        <div className={styles.logoCircle}></div>

        <div>
          <h1 className={styles.logoTitle}>CONTAX</h1>
          <span className={styles.logoSub}>ME & MEI</span>
        </div>
       </div>
      </header>
    </div>
  )
}

export default Inicial;
