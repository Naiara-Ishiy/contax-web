import styles from './index.module.css';
import logo from '../../../assets/logo2.png';

function Login() {
  return (
    <div className={styles.pagina}>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src={logo} alt="logo" className={styles.logoTopo} />
          <div>
            <strong>CONTAX</strong>
            <span>ME & MEI</span>
          </div>
        </div>

        <button className={styles.botaoTema}>🌙</button>
      </header>

      {/* CONTEÚDO */}
      <main className={styles.container}>
        <div className={styles.card}>

          <img src={logo} alt="logo" className={styles.logoCard} />

          <h2>CONTAX</h2>
          <span className={styles.subtitulo}>Gestão ME & MEI</span>

          <h3 className={styles.titulo}>
            Bem-vindo(a) 👋
          </h3>

          <p className={styles.descricao}>
            Acesse o sistema com suas credenciais abaixo.
          </p>

          {/* SELECT */}
          <label>Entrar como</label>
          <select>
            <option>Administrador</option>
            <option>Usuário</option>
          </select>

          {/* INPUT */}
          <label>Senha do administrador</label>
          <input type="password" placeholder="••••••••" />

          {/* CHECK */}
          <div className={styles.opcoes}>
            <input type="checkbox" />
            <span>Mostrar senha</span>
          </div>

          {/* BOTÃO */}
          <button className={styles.botaoLogin}>
            Entrar no sistema
          </button>

          <small className={styles.rodape}>
            © CONTAX — Sistema ME & MEI
          </small>

        </div>
      </main>
    </div>
  );
}

export default Login;