import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Calculator, Hourglass, CheckCircle, CalendarDays, ChevronDown, BarChart3, FileText } from 'lucide-react';
import styles from './index.module.css';
import logo from '../../../assets/logoContaxCor.png';
import api from '../../../services/apis';

// --- FUNÇÕES AUXILIARES ---
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
  if (!value || typeof value !== 'string') return value || '--/--/----';
  if (!value.includes('-')) return value; 
  const [year, month, day] = value.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
}

// --- COMPONENTE SECUNDÁRIO ---
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
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {documentos.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.emptyTableText}>
                Nenhum documento encontrado neste período.
              </td>
            </tr>
          ) : (
            documentos.map((doc) => (
              <tr key={doc.id || doc.doc_id || doc.doc}>
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
                <td className={styles.actionCell}>
                  <button
                    type="button"
                    className={styles.viewButton}
                    onClick={() => window.open(`http://localhost:3333/documentos/preview/${doc.id || doc.doc_id}`, '_blank')}
                  >
                    Visualizar
                  </button>
                  <button
                    type="button"
                    className={styles.downloadButton}
                    onClick={() => window.open(`http://localhost:3333/documentos/download/${doc.id || doc.doc_id}`, '_blank')}                  
                  >
                    Baixar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function MenuMEGerente() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filtroMes, setFiltroMes] = useState('06');
  const [filtroAno, setFiltroAno] = useState('2026');
  const [dropdownMesAberto, setDropdownMesAberto] = useState(false);
  const [dropdownAnoAberto, setDropdownAnoAberto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownMesRef = useRef(null);
  const dropdownAnoRef = useRef(null);

  const [resumoDashboard, setResumoDashboard] = useState(null);
  const [impostos, setImpostos] = useState([]);
  const [faturamento, setFaturamento] = useState(null);
  const [caixa, setCaixa] = useState(null);
  const [prazos, setPrazos] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  const empresaLogada =
  JSON.parse(localStorage.getItem('empresa')) || {};

const empId = empresaLogada.emp_id;

const tipoEmpresa = Number(
  empresaLogada.tipoNumerico
);

const nivelAcesso = Number(
  empresaLogada.nivel_acesso
);

const isGerente = nivelAcesso === 1;
const isVisualizador = nivelAcesso === 0;

  const listaAnos = ['2024', '2025', '2026', '2027'];
  const listaMeses = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  useEffect(() => {
    function cliqueFora(event) {
      if (dropdownMesRef.current && !dropdownMesRef.current.contains(event.target)) {
        setDropdownMesAberto(false);
      }
      if (dropdownAnoRef.current && !dropdownAnoRef.current.contains(event.target)) {
        setDropdownAnoAberto(false);
      }
    }
    document.addEventListener('mousedown', cliqueFora);
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, []);

  const empresa = {
    nome: empresaLogada.nome || 'Empresa',
    tipo: tipoEmpresa === 0 ? 'ME' : 'MEI',
    cnpj: empresaLogada.cnpj || '--',
    limiteMensal: tipoEmpresa === 1 ? 6750 : 20000,
    caixaAtual: 0,
  };

  const buscarDashboardME = async () => {
    try {
      const response = await api.get('/dashboard/resumo', {
        params: {
          emp_id: empId,
          tipoEmpresa,
          nivelAcesso,
        }
      });
      setResumoDashboard(response.data.dados || null);
    } catch (err) {
      console.error(err);
    }
  };

  const buscarImpostos = async () => {
    try {
      const response = await api.get('/dashboard/impostos', {
        params: {
          emp_id: empId,
          tipoEmpresa,
          nivelAcesso,
        }
     });
      setImpostos(response.data.dados?.impostos || []);
    } catch (err) {
      console.error(err);
      setImpostos([]);
    }
  };

  const buscarFaturamento = async () => {
    try {
      const response = await api.get('/dashboard/faturamento', {
        params: {
          emp_id: empId,
          tipoEmpresa,
          nivelAcesso,
        }
      });
      setFaturamento(response.data.dados || null);
    } catch (err) {
      console.error(err);
    }
  };

  const buscarCaixa = async () => {
    try {
      const response = await api.get('/dashboard/caixa', {
        params: {
          emp_id: empId,
          tipoEmpresa,
          nivelAcesso,
        }
      });
      setCaixa(response.data.dados || null);
    } catch (err) {
      console.error(err);
    }
  };

  const buscarPrazos = async () => {
    try {
      const dadosEmpresa = JSON.parse(localStorage.getItem('empresa')) || {};
      const empId = dadosEmpresa.emp_id || dadosEmpresa.id || 1;
      
      // CORREÇÃO DA ROTA: Direcionado para o arquivo de rotas correto (/prazos)
      const response = await api.get(`/prazos?emp_id=${empId}&limit=30`);
      
      if (response.data && response.data.sucesso) {
        setPrazos(response.data.dados || []);
      } else {
        setPrazos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar obrigações na rota /prazos:", err);
      setPrazos([]);
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
  }, [filtroMes, filtroAno]);

  const periodoFormatadoYMD = useMemo(() => {
    return `${filtroAno}-${filtroMes}`;
  }, [filtroAno, filtroMes]);

  const documentosFiltrados = useMemo(() => {
    if (!periodoFormatadoYMD) return documentos;
    return documentos.filter((doc) => doc.data?.startsWith(periodoFormatadoYMD));
  }, [documentos, periodoFormatadoYMD]);

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

  const notasFiscaisFaturamento = [
    { numero: "NF-e 0012", cliente: "Tech Solutions Ltda", data: `10/${filtroMes}/${filtroAno}`, valor: totalFaturado * 0.6 || 4800, status: "Emitida" },
    { numero: "NF-e 0013", cliente: "Global Trade S/A", data: `18/${filtroMes}/${filtroAno}`, valor: totalFaturado * 0.4 || 3200, status: "Emitida" },
  ];

  const obterEstiloPrazo = (statusDesc) => {
    switch (statusDesc) {
      case 'Concluído':
        return { color: '#00a896', badgeClass: '' };
      case 'Vencido':
        return { color: '#e74c3c', badgeClass: styles.statusPending };
      case 'Vence esta semana':
        return { color: '#f39c12', badgeClass: styles.statusPending };
      case 'Pendente':
      default:
        return { color: '#2d87f0', badgeClass: '' };
    }
  };

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

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <>
            <div className={styles.dashboardLayout}>
              <section className={`${styles.card} ${styles.companyHeroCard}`}>
                <div className={styles.companyHeroPeriod}>
                  <div className={styles.periodBox}>
                    <span>Período:</span>
                    
                    <div className={styles.containerPeriodo} ref={dropdownMesRef}>
                      <button 
                        type="button" 
                        className={styles.periodInput}
                        onClick={() => { setDropdownMesAberto(!dropdownMesAberto); setDropdownAnoAberto(false); }}
                      >
                        <CalendarDays size={18} />
                        <span>{listaMeses.find(m => m.value === filtroMes)?.label}</span>
                        <ChevronDown size={16} style={{ transform: dropdownMesAberto ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </button>

                      {dropdownMesAberto && (
                        <ul className={styles.periodDropdown}>
                          {listaMeses.map((mes) => (
                            <li key={mes.value}>
                              <button
                                type="button"
                                className={filtroMes === mes.value ? styles.periodDropdownOptionActive : styles.periodDropdownOption}
                                onClick={() => {
                                  setFiltroMes(mes.value);
                                  setDropdownMesAberto(false);
                                }}
                              >
                                {mes.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className={styles.containerPeriodo} ref={dropdownAnoRef}>
                      <button 
                        type="button" 
                        className={styles.periodInput}
                        onClick={() => { setDropdownAnoAberto(!dropdownAnoAberto); setDropdownMesAberto(false); }}
                      >
                        <span>{filtroAno}</span>
                        <ChevronDown size={16} style={{ transform: dropdownAnoAberto ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                      </button>

                      {dropdownAnoAberto && (
                        <ul className={styles.periodDropdown}>
                          {listaAnos.map((ano) => (
                            <li key={ano}>
                              <button
                                type="button"
                                className={filtroAno === ano ? styles.periodDropdownOptionActive : styles.periodDropdownOption}
                                onClick={() => {
                                  setFiltroAno(ano);
                                  setDropdownAnoAberto(false);
                                }}
                              >
                                {ano}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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

        {/* --- CAIXA TAB --- */}
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

        {/* --- IMPOSTOS TAB --- */}
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
                    {impostos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className={styles.emptyTableText}>Nenhum imposto encontrado.</td>
                      </tr>
                    ) : (
                      impostos.map((item) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- DOCUMENTOS TAB --- */}
        {activeTab === 'documentos' && (
          <div className={styles.tabContent}>
            <section className={styles.card}>
              <TabelaDocumentos documentos={documentosFiltrados} />
            </section>
          </div>
        )}

        {/* --- FATURAMENTO TAB --- */}
        {activeTab === 'faturamento' && (
          <div className={styles.tabContent}>
            <section className={styles.card}>
              <div className={styles.limitCard}>
                <div className={styles.limitHeader}>
                  <h3>Análise do Teto Operacional</h3>
                  <span>Utilizado: {formatCurrency(totalFaturado)} de {formatCurrency(empresa.limiteMensal)}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percentualLimite}%` }} />
                </div>
                <div className={styles.limitFooter}>
                  <div>
                    <span>Disponibilidade Fiscal</span>
                    <strong>{formatCurrency(limiteRestante)}</strong>
                  </div>
                  <div className={styles.limitStatus}>
                    <strong>{percentualLimite.toFixed(1)}%</strong>
                    <span className={styles.healthBadge}>{statusLimite}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>DOCUMENTO</th>
                      <th>CLIENTE / TOMADOR</th>
                      <th>DATA EMISSÃO</th>
                      <th>VALOR</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalFaturado === 0 ? (
                      <tr>
                        <td colSpan="5" className={styles.emptyTableText}>
                          Nenhum faturamento registrado no período selecionado.
                        </td>
                      </tr>
                    ) : (
                      notasFiscaisFaturamento.map((nota, idx) => (
                        <tr key={idx}>
                          <td><strong>{nota.numero}</strong></td>
                          <td>{nota.cliente}</td>
                          <td>{nota.data}</td>
                          <td className={styles.valueCell}>{formatCurrency(nota.valor)}</td>
                          <td><span className={styles.noteStatusBadge}>{nota.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* --- PRAZOS TAB --- */}
        {activeTab === 'prazos' && (
          <div className={styles.tabContent}>
            <section className={styles.card}>
              <div className={styles.taxHeader}>
                <div>
                  <h1>Agenda de Obrigações</h1>
                  <p>Mantenha as obrigações da sua Microempresa organizadas para o período fiscal.</p>
                </div>
              </div>

              <div className={styles.prazosLista}>
                {prazos && prazos.length > 0 ? (
                  prazos.map((item) => {
                    const estilo = obterEstiloPrazo(item.status_descricao);
                    return (
                      <div 
                        key={item.praz_id} 
                        className={styles.prazoCard} 
                        style={{ borderLeft: `6px solid ${estilo.color}` }}
                      >
                        <div className={styles.prazoCardText}>
                          <h4>{item.praz_descricao}</h4>
                          <span>Vencimento Limite: <strong>{formatDateBR(item.praz_data_vencimento)}</strong></span>
                          {item.dias_restantes !== undefined && item.status_descricao !== 'Concluído' && (
                            <small style={{ display: 'block', marginTop: '6px', color: '#7f8c8d', fontWeight: '500' }}>
                              {item.dias_restantes < 0 
                                ? `⚠️ Atrasado há ${Math.abs(item.dias_restantes)} dias` 
                                : `⏱️ Resta(m) ${item.dias_restantes} dia(s)`}
                            </small>
                          )}
                        </div>
                        <div>
                          <span className={`${styles.noteStatusBadge} ${estilo.badgeClass}`}>
                            {item.status_descricao}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyTableText} style={{ padding: '40px 24px' }}>
                    Nenhuma obrigação ou prazo encontrado para esta empresa.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* --- PERFIL TAB --- */}
        {activeTab === 'perfil' && (
          <div className={styles.perfilGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Informações da Empresa</h2>
              </div>
              <div className={styles.perfilGroup}>
                <div className={styles.perfilField}>
                  <label>Razão Social</label>
                  <strong>{empresa.nome}</strong>
                </div>
                <div className={styles.perfilField}>
                  <label>CNPJ</label>
                  <span>{empresa.cnpj}</span>
                </div>
                <div className={styles.perfilField}>
                  <label>Regime Tributário</label>
                  <span className={`${styles.noteStatusBadge} ${styles.perfilStatusBadge}`}>
                    Simples Nacional / {empresa.tipo}
                  </span>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Configurações de Acesso</h2>
              </div>
              <div className={styles.perfilGroup}>
                <div className={styles.perfilField}>
                  <label>Nível de Permissão</label>
                  <span>Gerente (Cliente ME)</span>
                </div>
                <div className={styles.perfilField}>
                  <label>Vínculo Contábil</label>
                  <span className={styles.perfilVinculo}>
                    <div className={styles.perfilDot}></div> Sincronizado à Contabilidade
                  </span>
                </div>
                <button type="button" className={`${styles.periodInput} ${styles.btnAlterarSenha}`}>
                  Alterar Senha do Painel
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}