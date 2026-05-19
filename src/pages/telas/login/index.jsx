import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import logo from '../../../assets/logoContax.png';
import logoAlt from '../../../assets/logoContaxCor.png';

function Login() {

  const navigate = useNavigate();

  // STATES
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  // LOGIN
  function handleLogin() {

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    let tipo = '';

    // 🔹 REGRA DE NEGÓCIO (exemplo)
    if (email === 'admin@contax.com') {
      tipo = 'admin';
    } else if (email === 'gerente@contax.com') {
      tipo = 'gerente';
    } else {
      tipo = 'usuario';
    }

    // 🔐 validação de senha (exemplo simples)
    if (senha !== '1234') {
      setErro('Senha inválida');
      return;
    }

    // salvar sessão
    localStorage.setItem('user', JSON.stringify({ email, tipo }));

    // redirecionamento por tipo
    if (tipo === 'admin') navigate('/tela/menuAdm');
    if (tipo === 'gerente') navigate('/tela/menuMEI');
    if (tipo === 'usuario') navigate('/tela/menuME');
  }

  return (
    <div className={styles.pagina}>

      {/* HEADER */}
      {/*  <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src={logo} alt="logo" className={styles.logoTopo} />
           <div>
            <strong>ONTAX</strong>
            <span>ME & MEI</span>
          </div> 
        </div> 
      </header> */}

      {/* CONTEÚDO */}
      <main className={styles.container}>
        <div className={styles.card}>

          <img src={logoAlt} alt="logoAlt" className={styles.logoCard} />

          <h2>CONTAX</h2>
          <span className={styles.subtitulo}>Gestão ME & MEI</span>

          <h3 className={styles.titulo}>
            Bem-vindo(a)
          </h3>

          <p className={styles.descricao}>
            Acesse o sistema com suas credenciais abaixo.
          </p>

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            autoComplete="email"
            placeholder="seuemail@contax.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* SENHA */}
          <label>Senha</label>
          <input
            type={mostrarSenha ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {/* CHECK */}
          <div className={styles.opcoes}>
            <input
              type="checkbox"
              id="mostrarSenha"
              checked={mostrarSenha}
              onChange={() => setMostrarSenha(!mostrarSenha)}
            />
            <span>Mostrar senha</span>
          </div>

          <button
            type="button"
            className={styles.forgotPassword}
          >
            Esqueci minha senha
          </button>

          {/* BOTÃO */}
          <button
            className={styles.botaoLogin}
            onClick={handleLogin}
          >
            Entrar no sistema
          </button>

          <small className={styles.rodape}>
            © CONTAX
          </small>

        </div>
      </main>
    </div>
  );
}

export default Login;