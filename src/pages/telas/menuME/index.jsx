import React, { useMemo, useState, useEffect } from 'react';
import { Calculator, Hourglass, CheckCircle, CalendarDays, Download, Info, ChevronDown, BarChart3, FileText } from 'lucide-react';
import styles from './index.module.css';
import logo from '../../../assets/logoContaxCor.png';
import api from '../../../services/apis';

export default function MenuME() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filtroMes, setFiltroMes] = useState('2026-05');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [resumoDashboard, setResumoDashboard] = useState(null);
  const [impostos, setImpostos] = useState([]);
  const [faturamento, setFaturamento] = useState(null);
  const [caixa, setCaixa] = useState(null);
  const [prazos, setPrazos] = useState(null);
  const [documentos, setDocumentos] = useState([]);

  // Dado base local para fallback de limites/CNPJ caso necessário
  const empresa = {
    nome: 'Empresa ME',
    tipo: 'ME',
    cnpj: '12.345.678/0001-90',
    limiteMensal: 30000,
    caixaAtual: 12450,
  };

  const buscarDashboardME = async () => {
    try {
      const response = await api.get('/dashboard/resumo');
      setResumoDashboard(response.data.dados || null);
    } catch (err) {
      console.error(err);
    }
  };

  const buscarImpostos = async () => {
    try {
      const response = await api.get('/dashboard/impostos');
      setImpostos(response.data.dados?.impostos || []);
    } catch (err) {
      console.error(err);
      setImpostos([]);
    }
  };

  const buscarFaturamento = async () => {
    try {
      const response = await api.get('/dashboard/faturamento');
      setFaturamento(response.data.dados || null);
    } catch (err) {
      console.error(err);
      setFaturamento(null);
    }
  };

  const buscarCaixa = async () => {
    try {
      const response = await api.get('/dashboard/caixa');
      setCaixa(response.data.dados || null);
    } catch (err) {
      console.error(err);
      setCaixa(null);
    }
  };

  const buscarPrazos = async () => {
    try {
      const response = await api.get('/dashboard/prazos');
      setPrazos(response.data.dados || null);
    } catch (err) {
      console.error(err);
      setPrazos(null);
    }
  };

  const buscarDocumentosLegados = async () => {
    try {
      const dadosEmpresa = JSON.parse(localStorage.getItem('empresa')) || {};
      const empId = dadosEmpresa.emp_id || dadosEmpresa.id || 1;
      const resposta = await api.get(`/documentos?emp_id=${empId}`);
      
      if (resposta.data && resposta.data.sucesso) {
        const dadosFormatados = resposta.data.dados.map(item => ({
          id: item.doc_id,
          documento: item.doc_nome_original || 'documento.pdf',
          tipo: item.tpd_descricao || 'NF-e',
          referencia: item.fin_categoria || 'Serviço',
          data: item.fin_data_emissao ? item.fin_data_emissao.split('T')[0] : item.doc_data_upload?.split('T')[0],
          valor: Number(item.fin_valor_total || 0),
          status: item.doc_status === 1 ? 'Emitida' : 'Pago'
        }));
        setDocumentos(dadosFormatados);
      }
    } catch (erro) {
      console.error("Erro ao carregar documentos gerais:", erro);
    }
  };

  // Carregamento unificado com tratamento de loading limpo
  useEffect(() => {
    const carregarTudo = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          buscarDashboardME(),
          buscarImpostos(),
          buscarFaturamento(),
          buscarCaixa(),
          buscarPrazos(),
          buscarDocumentosLegados()
        ]);
      } catch (err) {
        setError("Não foi possível sincronizar os dados do painel.");
      } finally {
        setLoading(false);
      }
    };

    carregarTudo();
  }, []);

  const documentosFiltrados = useMemo(() => {
    if (!filtroMes) return documentos;
    return documentos.filter((doc) => doc.data?.startsWith(filtroMes));
  }, [documentos, filtroMes]);

  const totalFaturado = useMemo(() => {
    return documentosFiltrados
      .filter((doc) => doc.tipo !== 'DAS')
      .reduce((acc, doc) => acc + Number(doc.valor || 0), 0);
  }, [documentosFiltrados]);

  const totalDespesas = useMemo(() => {
    return documentosFiltrados
      .filter((doc) => doc.tipo === 'DAS')
      .reduce((acc, doc) => acc + Number(doc.valor || 0), 0);
  }, [documentosFiltrados]);

  const impostosPendentes = impostos.filter((item) => item.status === 'Pendente');
  const impostosPagos = impostos.filter((item) => item.status === 'Pago');

  const totalImpostosPendentes = impostosPendentes.reduce((acc, item) => acc + item.valor, 0);
  const totalImpostosPagos = impostosPagos.reduce((acc, item) => acc + item.valor, 0);
  const proximoImposto = impostosPendentes[0];

  const percentualLimite = Math.min((totalFaturado / empresa.limiteMensal) * 100, 100);
  const limiteRestante = Math.max(empresa.limiteMensal - totalFaturado, 0);
  const statusLimite = percentualLimite >= 90 ? 'Risco' : percentualLimite >= 70 ? 'Atenção' : 'Saudável';

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando informações do painel...</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.logoArea}>
            <img src={logo} alt="Contax" className={styles.logoImg} />
            <div className={styles.logoText}>
              <h1 className={styles.brand}>CONTAX</h1>
              <span className={styles.brandSubtitle}>ME &amp; MEI - Dashboard</span>
            </div>
          </div>

          <nav className={styles.nav}>
            {['dashboard', 'documentos', 'impostos', 'faturamento', 'caixa', 'prazos', 'perfil'].map((tab) => (
              <button
                key={tab}
                className={`${styles.navButton} ${activeTab === tab ? styles.navButtonActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </nav>

          <div className={styles.userArea}>
            <span className={styles.userText}>Acesso: ME</span>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        {activeTab === 'dashboard' && (
          <>
            <div className={styles.dashboardLayout}>
              <section className={`${styles.card} ${styles.companyHeroCard}`}>
                <div className={styles.companyHeroPeriod}>
                  <div className={styles.periodBox}>
                    <span>Período:</span>
                    <button type="button" className={styles.periodInput}>
                      <CalendarDays size={18} />
                      <span>{formatMonthBR(filtroMes)}</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.companyHeader}>
                  <div className={styles.dot}></div>
                  <h1 className={styles.companyTitle}>{empresa.nome}</h1>
                </div>
                <p className={styles.companyCnpj}>{empresa.cnpj}</p>

                <div className={styles.heroMetrics}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricIcon}><BarChart3 size={28} /></div>
                    <div className={styles.metricContent}>
                      <span>Faturamento do mês</span>
                      <strong>{formatCurrency(totalFaturado)}</strong>
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricIcon}><Calculator size={28} /></div>
                    <div className={styles.metricContent}>
                      <span>Impostos lançados</span>
                      <strong>{formatCurrency(totalImpostosPendentes + totalImpostosPagos)}</strong>
                    </div>
                  </div>

                  <div className={styles.metricCard}>
                    <div className={styles.metricIcon}><FileText size={28} /></div>
                    <div className={styles.metricContent}>
                      <span>Documentos</span>
                      <strong>{documentosFiltrados.length}</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.limitCard}>
                  <div className={styles.limitHeader}>
                    <h3>Situação do limite mensal</h3>
                    <span>Utilizado: {formatCurrency(totalFaturado)} de {formatCurrency(empresa.limiteMensal)}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${percentualLimite}%` }} />
                  </div>
                  <div className={styles.limitFooter}>
                    <div>
                      <span>Restante</span>
                      <strong>{formatCurrency(limiteRestante)}</strong>
                    </div>
                    <div className={styles.limitStatus}>
                      <strong>{percentualLimite.toFixed(1)}%</strong>
                      <span className={styles.healthBadge}>{statusLimite}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Documentos do período</h2>
              </div>
              <TabelaDocumentos documentos={documentosFiltrados} />
            </section>
          </>
        )}

        {activeTab === 'caixa' && (
          <>
            <section className={`${styles.card} ${styles.cashHeroCard}`}>
              <div className={styles.cashHeroHeader}>
                <div className={styles.cashIconBox}>💼</div>
                <div>
                  <h2>Saldo atual</h2>
                  <strong>{formatCurrency(caixa?.resumo?.saldoAtual || empresa.caixaAtual)}</strong>
                  <p>Saldo disponível em caixa</p>
                </div>
              </div>
            </section>

            <div className={styles.cashGrid}>
              <section className={`${styles.card} ${styles.cashMovementCard}`}>
                <div className={styles.cashMovementHeader}>
                  <div className={styles.cashIconBoxGreen}>↓</div>
                  <div>
                    <h3>Entradas do Mês</h3>
                    <strong>{formatCurrency(totalFaturado)}</strong>
                    <p>Total de entradas no período</p>
                  </div>
                </div>
              </section>

              <section className={`${styles.card} ${styles.cashMovementCard}`}>
                <div className={styles.cashMovementHeader}>
                  <div className={styles.cashIconBoxRed}>↑</div>
                  <div>
                    <h3>Saídas do Mês</h3>
                    <strong className={styles.cashRedValue}>{formatCurrency(totalDespesas)}</strong>
                    <p>Total de saídas no período</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === 'impostos' && (
          <div className={styles.tabContent}>
            <div className={styles.taxHeader}>
              <div>
                <h1>Impostos lançados</h1>
                <p>Acompanhe guias, vencimentos e pagamentos informados pela contabilidade.</p>
              </div>
            </div>

            <div className={styles.impostosGrid}>
              <div className={styles.impostoCard}>
                <div className={`${styles.taxIconBox} ${styles.taxIconBlue}`}><Calculator size={30} /></div>
                <div>
                  <h3>Total de impostos</h3>
                  <strong>{formatCurrency(totalImpostosPendentes + totalImpostosPagos)}</strong>
                </div>
              </div>

              <div className={styles.impostoCard}>
                <div className={`${styles.taxIconBox} ${styles.taxIconOrange}`}><Hourglass size={30} /></div>
                <div>
                  <h3>Guias pendentes</h3>
                  <strong className={styles.orangeValue}>{impostosPendentes.length}</strong>
                  <span>Total: {formatCurrency(totalImpostosPendentes)}</span>
                </div>
              </div>

              <div className={styles.impostoCard}>
                <div className={`${styles.taxIconBox} ${styles.taxIconGreen}`}><CheckCircle size={30} /></div>
                <div>
                  <h3>Guias pagas</h3>
                  <strong className={styles.greenValue}>{impostosPagos.length}</strong>
                  <span>Total: {formatCurrency(totalImpostosPagos)}</span>
                </div>
              </div>
            </div>

            {proximoImposto && (
              <section className={styles.proximoVencimentoCard}>
                <div className={styles.dueLeft}>
                  <div className={styles.dueIconBox}><CalendarDays size={30} /></div>
                  <div>
                    <span>Próximo vencimento</span>
                    <h3>{proximoImposto.tipo} {proximoImposto.referencia}</h3>
                    <p>Vence em {formatDateBR(proximoImposto.vencimento)}</p>
                  </div>
                </div>
                <div className={styles.dueValue}>
                  <strong>{formatCurrency(proximoImposto.valor)}</strong>
                </div>
              </section>
            )}

            <section className={styles.card}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>TIPO</th>
                      <th>REFERÊNCIA</th>
                      <th>VENCIMENTO</th>
                      <th>VALOR</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impostos.map((item) => (
                      <tr key={item.id}>
                        <td>{item.tipo}</td>
                        <td>{item.referencia}</td>
                        <td>{formatDateBR(item.vencimento)}</td>
                        <td>{formatCurrency(item.valor)}</td>
                        <td>
                          <span className={`${styles.noteStatusBadge} ${item.status === 'Pendente' ? styles.statusPending : ''}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'documentos' && (
          <div className={styles.tabContent}>
            <section className={styles.card}>
              <TabelaDocumentos documentos={documentosFiltrados} />
            </section>
          </div>
        )}

        {/* Fallbacks amigáveis para as abas restantes */}
        {['faturamento', 'prazos', 'perfil'].includes(activeTab) && (
          <section className={styles.card}>
            <div className={styles.emptyBox}>
              Conteúdo da aba <strong>{getTabLabel(activeTab)}</strong> em desenvolvimento técnico ou integrado à API de suporte.
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function TabelaDocumentos({ documentos }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>DOCUMENTO</th>
            <th>TIPO</th>
            <th>REFERÊNCIA</th>
            <th>DATA</th>
            <th>VALOR</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {documentos.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.emptyTableText}>
                Nenhum documento encontrado neste período.
              </td>
            </tr>
          ) : (
            documentos.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <button
                    type="button"
                    className={styles.documentTitleButton}
                    onClick={() => window.open(doc.url || '#', '_blank')}
                  >
                    {doc.documento}
                  </button>
                </td>
                <td><span className={styles.documentType}>{doc.tipo}</span></td>
                <td>{doc.referencia}</td>
                <td>{formatDateBR(doc.data)}</td>
                <td className={styles.valueCell}>{formatCurrency(doc.valor)}</td>
                <td><span className={styles.noteStatusBadge}>{doc.status}</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function getTabLabel(tab) {
  const labels = {
    dashboard: 'Dashboard',
    documentos: 'Documentos',
    impostos: 'Impostos',
    faturamento: 'Faturamento',
    caixa: 'Caixa',
    prazos: 'Prazos',
    perfil: 'Perfil',
  };
  return labels[tab] || tab;
}

function formatCurrency(value) {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDateBR(value) {
  if (!value || typeof value !== 'string' || !value.includes('-')) return '--/--/----';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function formatMonthBR(value) {
  if (!value || !value.includes('-')) return 'Mês atual';
  const [year, month] = value.split('-');
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${months[Number(month) - 1]} de ${year}`;
}