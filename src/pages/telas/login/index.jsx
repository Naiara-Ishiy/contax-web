import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import logoAlt from '../../../assets/logoContaxCor.png';
import api from '../../../services/apis';

function Login() {
  const navigate = useNavigate();

  // STATES
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // LOGIN
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const res = await api.get('/usuarios/login', {
        params: { email, senha }
      });
      const data = res.data || {};
      const dados = data.dados || {};

      const user = dados.usuario;
      const empresa = dados.empresa_padrao;
      const empresas = dados.empresas || [];

      if (user) localStorage.setItem('user', JSON.stringify(user));
      if (empresas) localStorage.setItem('empresas', JSON.stringify(empresas));

      if (empresa) {
        localStorage.setItem('empresa', JSON.stringify(empresa));
      }

      // decide rota baseada no tipo do usuário ou da empresa
      const tipo = String(
        empresa?.nivel_descricao ||
        ''
      ).toLowerCase();

      if (tipo.includes('administrador')) {
        navigate('/tela/menuAdm');
      } else {
        navigate('/tela/menuME');
      }
      
    } catch (err) {
      // fallback: manter comportamento local caso a API não esteja disponível
      console.error(err);
      setErro('Falha ao autenticar — verifique suas credenciais ou a API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pagina}>

      {/* CONTEÚDO */}
      <main className={styles.container}>
        <div className={styles.card}>
          <img src={logoAlt} alt="logoAlt" className={styles.logoCard} />

          <h2>CONTAX</h2>
          <span className={styles.subtitulo}>Gestão ME & MEI</span>

          <h3 className={styles.titulo}>Bem-vindo(a)</h3>

          <p className={styles.descricao}>Acesse o sistema com suas credenciais abaixo.</p>

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
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="button" className={styles.forgotPassword}>
            Esqueci minha senha
          </button>

          {erro && <p className={styles.errorMessage}>{erro}</p>}

          {/* BOTÃO */}
          <button
            type='button' 
            className={styles.botaoLogin} 
            onClick={handleLogin} 
            disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no sistema'}              
          </button>

          <small className={styles.rodape}>© CONTAX</small>
        </div>
      </main>
    </div>
  );
}

export default Login;
