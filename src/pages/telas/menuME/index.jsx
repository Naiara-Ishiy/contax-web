import React, { useMemo, useState } from 'react';
import {Calculator, Hourglass, CheckCircle, CalendarDays, Download,Info, ChevronDown, BarChart3, FileText} from 'lucide-react';
import styles from './index.module.css';
import logo from '../../../assets/logoContaxCor.png';

export default function MenuME() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filtroMes, setFiltroMes] = useState('2026-05');

  const empresa = {
    nome: 'Empresa ME',
    tipo: 'ME',
    cnpj: '12.345.678/0001-90',
    limiteMensal: 30000,
    caixaAtual: 12450,
  };

  const [documentos] = useState([
    {
      id: 1,
      data: '2026-05-04',
      documento: 'nf-servico-001.pdf',
      tipo: 'NF-e',
      referencia: 'Serviço mensal',
      valor: 5200,
      status: 'Emitida',
    },
    {
      id: 2,
      data: '2026-05-11',
      documento: 'recibo-002.pdf',
      tipo: 'Recibo',
      referencia: 'Pagamento recebido',
      valor: 1800,
      status: 'Pago',
    },
    {
      id: 3,
      data: '2026-05-18',
      documento: 'das-maio.pdf',
      tipo: 'DAS',
      referencia: 'Imposto mensal',
      valor: 620,
      status: 'Pendente',
    },
  ]);

  const [impostos] = useState([
  {
    id: 1,
    tipo: 'DAS',
    referencia: 'Maio/2026',
    vencimento: '2026-05-20',
    valor: 312,
    status: 'Pendente',
    arquivo: 'das-maio-2026.pdf',
  },
  {
    id: 2,
    tipo: 'DAS',
    referencia: 'Abril/2026',
    vencimento: '2026-04-20',
    valor: 312,
    status: 'Pago',
    arquivo: 'das-abril-2026.pdf',
  },
  {
    id: 3,
    tipo: 'DAS',
    referencia: 'Março/2026',
    vencimento: '2026-03-20',
    valor: 312,
    status: 'Pago',
    arquivo: 'das-marco-2026.pdf',
  },
]);

  const documentosFiltrados = useMemo(() => {
    if (!filtroMes) return documentos;
    return documentos.filter((doc) => doc.data?.startsWith(filtroMes));
  }, [documentos, filtroMes]);

  const totalDocumentos = documentosFiltrados.length;

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

  const impostosPendentes = impostos.filter(
    (item) => item.status === 'Pendente'
  );

  const impostosPagos = impostos.filter(
    (item) => item.status === 'Pago'
  );

  const totalImpostosPendentes = impostosPendentes.reduce(
    (acc, item) => acc + item.valor,
    0
  );

  const totalImpostosPagos = impostosPagos.reduce(
    (acc, item) => acc + item.valor,
    0
  );

const proximoImposto = impostosPendentes[0];

  const impostoEstimado = totalFaturado * 0.06;
  const percentualLimite = Math.min((totalFaturado / empresa.limiteMensal) * 100, 100);
  const limiteRestante = Math.max(empresa.limiteMensal - totalFaturado, 0);

  const statusLimite =
    percentualLimite >= 90 ? 'Risco' : percentualLimite >= 70 ? 'Atenção' : 'Saudável';

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
  {activeTab === 'dashboard' && (
    <>
      <div className={styles.dashboardLayout}>
        <section className={`${styles.card} ${styles.companyHeroCard}`}>
          <div className={styles.companyHeroPeriod}>
            <div className={styles.periodBox}>
              <span>Período:</span>

              <button type="button" className={styles.periodInput}>
                <CalendarDays size={18} />
                <span>Maio/2026</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className={styles.companyHeader}>
            <div className={styles.dot}></div>

            <h1 className={styles.companyTitle}>
              {empresa.nome}
            </h1>
          </div>

          <p className={styles.companyCnpj}>
            {empresa.cnpj}
          </p>

          <div className={styles.heroMetrics}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <BarChart3 size={28} />
              </div>

              <div className={styles.metricContent}>
                <span>Faturamento do mês</span>
                <strong>{formatCurrency(totalFaturado)}</strong>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Calculator size={28} />
              </div>

              <div className={styles.metricContent}>
                <span>Impostos lançados</span>
                <strong>{formatCurrency(totalImpostosPendentes + totalImpostosPagos)}</strong>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <FileText size={28} />
              </div>

              <div className={styles.metricContent}>
                <span>Documentos</span>
                <strong>{documentosFiltrados.length}</strong>
              </div>
            </div>
          </div>

          <div className={styles.limitCard}>
            <div className={styles.limitHeader}>
              <h3>Situação do limite mensal</h3>

              <span>
                Utilizado: {formatCurrency(totalFaturado)} de{' '}
                {formatCurrency(empresa.limiteMensal)}
              </span>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${percentualLimite}%` }}
              />
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
                  <strong>{formatCurrency(empresa.caixaAtual)}</strong>
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

        {activeTab === 'despesas' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Despesas</h2>
            </div>
            <div className={styles.emptyBox}>
              Despesas do período: {formatCurrency(totalDespesas)}
            </div>
          </section>
        )}

{activeTab === 'impostos' && (
  <div className={styles.tabContent}>
    <div className={styles.taxHeader}>
      <div>
        <h1>Impostos lançados</h1>
        <p>Acompanhe guias, vencimentos e pagamentos informados pela contabilidade.</p>
      </div>

      <div className={styles.periodBox}>
        <span>Período:</span>

        <button type="button" className={styles.periodInput}>
          <CalendarDays size={18} />
          <span>Maio/2026</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>

    <div className={styles.impostosGrid}>
      <div className={styles.impostoCard}>
        <div className={`${styles.taxIconBox} ${styles.taxIconBlue}`}>
          <Calculator size={30} />
        </div>

        <div>
          <h3>Total de impostos</h3>
          <strong>{formatCurrency(totalImpostosPendentes + totalImpostosPagos)}</strong>
          <span>Valores lançados no período</span>
        </div>
      </div>

      <div className={styles.impostoCard}>
        <div className={`${styles.taxIconBox} ${styles.taxIconOrange}`}>
          <Hourglass size={30} />
        </div>

        <div>
          <h3>Guias pendentes</h3>
          <strong className={styles.orangeValue}>{impostosPendentes.length}</strong>
          <span>Total: {formatCurrency(totalImpostosPendentes)}</span>
        </div>
      </div>

      <div className={styles.impostoCard}>
        <div className={`${styles.taxIconBox} ${styles.taxIconGreen}`}>
          <CheckCircle size={30} />
        </div>

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
          <div className={styles.dueIconBox}>
            <CalendarDays size={30} />
          </div>

          <div>
            <span>Próximo vencimento</span>
            <h3>
              {proximoImposto.tipo} {proximoImposto.referencia}
            </h3>
            <p>Vence em {formatDateBR(proximoImposto.vencimento)}</p>
            <small>Pendente</small>
          </div>
        </div>

        <div className={styles.dueValue}>
          <span>Valor</span>
          <strong>{formatCurrency(proximoImposto.valor)}</strong>
        </div>

        <button type="button" className={styles.downloadGuideButton}>
          <Download size={20} />
          Baixar guia
        </button>
      </section>
    )}

    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Guias de impostos</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>TIPO</th>
              <th>REFERÊNCIA</th>
              <th>VENCIMENTO</th>
              <th>VALOR</th>
              <th>STATUS</th>
              <th>DOCUMENTO</th>
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
                  <span
                    className={`${styles.noteStatusBadge} ${
                      item.status === 'Pendente' ? styles.statusPending : ''
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <button type="button" className={styles.documentTitleButton}>
                    {item.arquivo}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <div className={styles.taxInfoBox}>
      <Info size={18} />
      <span>Os valores exibidos são baseados nos lançamentos financeiros informados no sistema.</span>
    </div>
  </div>
)}

{activeTab === 'documentos' && (
  <div className={styles.tabContent}>
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Documentos disponíveis</h2>
      </div>

      <TabelaDocumentos documentos={documentosFiltrados} />
    </section>
  </div>
)}
      </main>
    </div>
  );
}

function TabelaDocumentos({ documentos, onAbrirDocumento  }) {
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
              <td colSpan="7" className={styles.emptyTableText}>
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
                    onClick={() => window.open(doc.url || doc.doc_url || '#', '_blank')}
                    title="Baixar documento"
                    >
                      {doc.documento}
                    </button>
                  
                </td>
                <td>
                  <span className={styles.documentType}>{doc.tipo}</span>
                </td>
                <td>{doc.referencia}</td>
                <td>{formatDateBR(doc.data)}</td>
                <td className={styles.valueCell}>{formatCurrency(doc.valor)}</td>
                <td>
                  <span
                    className={`${styles.noteStatusBadge} ${
                      doc.status === 'Pendente' ? styles.statusPending : ''
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
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

  return labels[tab];
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDateBR(value) {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function formatMonthBR(value) {
  if (!value) return 'Mês atual';

  const [year, month] = value.split('-');

  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];

  return `${months[Number(month) - 1]} de ${year}`;
}
