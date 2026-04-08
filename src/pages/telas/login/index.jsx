import { useState } from 'react';
import styles from './index.module.css';


export default function Login() {

    const [mostrarSenha, serMostrarSenha] = useState(false);

  return (
    <div className={styles.container}>
     <header className={styles.header}>
        <div className={styles.logoArea}>
            <img src="/logo.png" alt="logo" className={styles.logo}/>
            
            <div>
                <h1 className={styles.logoTitulo}>CONTAX</h1>
                <p className={styles.logoSub}>
                 Gestão de Notas • Controle de DAS • Painel intuitivo
                </p>
            </div>
        </div>
     </header>


     <div className={styles.card}>

        <img src="/logo.png" alt="logo" className={styles.logoCard}/>

        <h2>CONTAX</h2>
        <span>Gestão ME & MEI</span>

        <h3 className={styles.bemVindo}>
            Bem-vindo(a) 👋
        </h3>

        <p className={styles.subtexto}>
            Acesse o sistema com suas credenciais abaixo.
        </p>

        <div className={styles.form}>
            <label>Entrar como</label>
            <select>
                <option>Administrador</option>
                <option>Usuário</option>
            </select>

            <label>Senha do Administrador</label>
            <input
               type={mostrarSenha ? "text" : "password"}
               placeholder="*******"
            />

            <div className={styles.opcoes}>
                <input
                  type="checkbox"
                  onChange={() => serMostrarSenha(!mostrarSenha)}
                />
                <span>Mostrar senha</span>
            </div>

            <button className={styles.botao}>
                Entrar no sistema
            </button>

        </div>

        <small className={styles.footer}>
          © CONTAX — Sistema ME & MEI
        </small>

     </div>
    </div>
  ); 
}