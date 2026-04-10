import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import logo from '../../../assets/logo2.png';

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
    if (tipo === 'admin') navigate('/dashboard/admin');
    if (tipo === 'gerente') navigate('/dashboard/gerente');
    if (tipo === 'usuario') navigate('/dashboard/user');
  }

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

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            placeholder="seuemail@contax.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* SENHA */}
          <label>Senha</label>
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {/* CHECK */}
          <div className={styles.opcoes}>
            <input
              type="checkbox"
              checked={mostrarSenha}
              onChange={() => setMostrarSenha(!mostrarSenha)}
            />
            <span>Mostrar senha</span>
          </div>

          {/* ERRO */}
          {erro && <span style={{ color: 'red' }}>{erro}</span>}

          {/* BOTÃO */}
          <button
            className={styles.botaoLogin}
            onClick={handleLogin}
          >
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