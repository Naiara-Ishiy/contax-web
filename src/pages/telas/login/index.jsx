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
  const [empresas, setEmpresas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/login', { email, senha });
      const data = res.data || {};

      const token = data.token || data.accessToken || null;
      const user = data.user || data.usuario || data;

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      const empresasResp = user?.empresas || user?.empresas_vinculadas || [];

      if (empresasResp && empresasResp.length > 1) {
        setEmpresas(empresasResp);
        // wait for user to select company
        return;
      }

      const empresa = empresasResp && empresasResp.length === 1 ? empresasResp[0] : null;

      // decide rota baseada no tipo do usuário ou da empresa
      const tipo = user?.tipo_acesso || user?.tipo || (empresa && empresa.emp_tipo) || 'usuario';

      if (tipo?.toLowerCase().includes('admin')) navigate('/tela/menuAdm');
      else if (tipo?.toLowerCase().includes('mei')) navigate('/tela/menuMEI');
      else navigate('/tela/menuME');
    } catch (err) {
      // fallback: manter comportamento local caso a API não esteja disponível
      console.error(err);
      setErro('Falha ao autenticar — verifique suas credenciais ou a API.');
    } finally {
      setLoading(false);
    }
  }

  function confirmarEmpresa(empresa) {
    setSelecionada(empresa);
    localStorage.setItem('empresa', JSON.stringify(empresa));

    const tipo = empresa?.emp_tipo || empresa?.tipo || '';

    if (tipo?.toLowerCase().includes('mei')) navigate('/tela/menuMEI');
    else navigate('/tela/menuME');
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

          {empresas.length > 1 && (
            <div className={styles.companySelect}>
              <h4>Selecione a empresa</h4>
              <ul className={styles.companyList}>
                {empresas.map((emp) => (
                  <li key={emp.emp_id || emp.id || emp.nome}>
                    <button
                      type="button"
                      className={styles.companyButton}
                      onClick={() => confirmarEmpresa(emp)}
                    >
                      {emp.emp_nome_fantasia || emp.nome || emp.empresa || emp.emp_razao_social}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BOTÃO */}
          <button className={styles.botaoLogin} onClick={handleLogin} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no sistema'}
          </button>

          <small className={styles.rodape}>© CONTAX</small>
        </div>
      </main>
    </div>
  );
}

export default Login;
