import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

import logo from '../../../assets/logoContaxCor.png';


export default function Inicial() {

  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      {/* CABEÇALHO */}
      <header className={styles.cabecalho}>
        <div className={styles.areaLogo}>
          <img src={logo} alt="Logo CONTAX" className={styles.logoImagem} />

          <div>
            <h1 className={styles.tituloLogo}>CONTAX</h1>
            <span className={styles.subtituloLogo}>
              ME & MEI <br />
              <small>Gestão de Notas • Controle de DAS • Painel intuitivo</small>
            </span>
          </div>
        </div>

        <nav className={styles.navegacao}>
          <button className={styles.botaoNav}>Benefícios</button>
          <button className={styles.botaoNav}>Como funciona</button>
          
          <button
          className={styles.botaoPrimario}
          onClick={() => navigate('/tela/login')}
          >
            Acessar o Sistema
          </button>

        </nav>
      </header>

      {/* HERO */}
      <section className={styles.hero}>

        <div className={styles.ladoEsquerdo}>
          <span className={styles.selo}>Para ME & MEI</span>

          <h2 className={styles.tituloPrincipal}>
            Controle financeiro e fiscal — claro, simples e direto.
          </h2>

          <p className={styles.descricao}>
            Organize notas fiscais, acompanhe limites mensais, gere histórico de DAS e visualize tudo em uma interface leve.
          </p>

          

          <div className={styles.tags}>
            <span>Rápido</span>
            <span>•</span>
            <span>Fácil</span>
            <span>•</span>
            <span>Responsivo</span>
          </div>

          <div className={styles.tagsSecundarias}>
            <span>Dashboard leve</span>
            <span>Controle de DAS</span>
          </div>
        </div>

        {/* MOCKUP */}
        <div className={styles.preview}>
          <div className={styles.previewTop}>
            <span>Preview</span>
            <span>Exemplo</span>
          </div>

          <div className={styles.previewHeader}></div>
          <div className={styles.previewBody}></div>
        </div>

      </section>

      {/* PASSOS */}
      <section className={styles.secaoCards}>

        <div className={styles.card}>
          <small>Passo 1</small>
          <h3>Cadastre sua empresa</h3>
          <p>Informe CNPJ e tipo ME/MEI</p>
        </div>

        <div className={styles.card}>
          <small>Passo 2</small>
          <h3>Lance suas notas</h3>
          <p>Registre data, descrição e valor</p>
        </div>

        <div className={styles.card}>
          <small>Passo 3</small>
          <h3>Acompanhe tudo</h3>
          <p>Painel limpo, dados sempre atualizados.</p>
        </div>

      </section>

      {/* FUNCIONALIDADES */}
      <section className={styles.funcionalidades}>

        <h3 className={styles.tituloSecao}>O que o CONTAX faz</h3>

        <div className={styles.listaFuncionalidades}>

          <div className={styles.itemFuncao}>
            <div className={styles.icone}></div>
            <div>
              <h4>Gestão de Notas</h4>
              <p>Cadastre notas por data, descrição e valor. Filtre por mês e empresa.</p>
            </div>
          </div>

          <div className={styles.itemFuncao}>
            <div className={styles.icone}></div>
            <div>
              <h4>Controle de DAS</h4>
              <p>Acompanhe pagamentos, vencimentos e histórico anual.</p>
            </div>
          </div>

          <div className={styles.itemFuncao}>
            <div className={styles.icone}></div>
            <div>
              <h4>Painel Intuitivo</h4>
              <p>Resumo financeiro por período, total por empresa e tabelas organizadas.</p>
            </div>
          </div>

        </div>

      </section>

      {/* RODAPÉ */}
      <footer className={styles.rodape}>
        <p>
          ©CONTAX — Versão clara da apresentação • 
          <span> Entrar no sistema</span>
        </p>
      </footer>

    </div>
  );
}

