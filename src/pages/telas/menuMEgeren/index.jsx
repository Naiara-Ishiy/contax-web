import React, { useMemo, useState } from 'react';
import styles from './index.module.css';
import logo from '../../../assets/logoContaxCor.png';

export default function MenuMEgeren() {
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
            {['dashboard', 'caixa', 'despesas', 'faturamento', 'imposto', 'notas'].map((tab) => (
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
                <div className={styles.companyHeroContent}>
                  <div className={styles.companyHeroLeft}>
                    <div className={styles.companyTop}>
                      <span className={styles.typeBadge}>{empresa.tipo}</span>
                    </div>
                    <div className={styles.companyName}>
                      <span className={styles.dot}></span>
                      <strong>{empresa.nome}</strong>
                    </div>

                    <p className={styles.companyCnpj}>{empresa.cnpj}</p>

                    <p className={styles.limitText}>
                      Limite: <strong>{formatCurrency(empresa.limiteMensal)}</strong>
                      <span>•</span>
                      Utilizado: <strong>{formatCurrency(totalFaturado)}</strong>
                      <span>•</span>
                      Restante:{' '}
                      <strong className={styles.positiveValue}>
                        {formatCurrency(limiteRestante)}
                      </strong>
                    </p>

                    <div className={styles.heroProgressArea}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${percentualLimite}%` }}
                        />
                      </div>

                      <strong className={styles.percent}>{percentualLimite.toFixed(1)}%</strong>

                      <span className={styles.statusBadge}>{statusLimite}</span>
                    </div>
                  </div>

                  <div className={styles.companyHeroRight}>
                    <span>Faturamento do mês</span>
                    <strong>{formatCurrency(totalFaturado)}</strong>
                    <small>{formatMonthBR(filtroMes)}</small>
                  </div>
                </div>
              </section>

              <section className={`${styles.card} ${styles.filterCard}`}>
                <div className={styles.cardHeader}>
                  <h2>Filtro</h2>
                </div>

                <div className={styles.filterBody}>
                  <div className={styles.field}>
                    <label>Mês</label>
                    <input
                      type="month"
                      value={filtroMes}
                      onChange={(e) => setFiltroMes(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <button className={styles.primaryButton}>Aplicar</button>
                </div>
              </section>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Caixa atual</span>
                <strong className={styles.statValue}>{formatCurrency(empresa.caixaAtual)}</strong>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Documentos</span>
                <strong className={styles.statValue}>{totalDocumentos}</strong>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Despesas</span>
                <strong className={styles.statValue}>{formatCurrency(totalDespesas)}</strong>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Imposto estimado</span>
                <strong className={styles.statValue}>{formatCurrency(impostoEstimado)}</strong>
              </div>
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

        {activeTab === 'faturamento' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Faturamento</h2>
            </div>
            <div className={styles.emptyBox}>
              Faturamento do mês: {formatCurrency(totalFaturado)}
            </div>
          </section>
        )}

        {activeTab === 'imposto' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Imposto</h2>
            </div>
            <div className={styles.emptyBox}>Estimativa: {formatCurrency(impostoEstimado)}</div>
          </section>
        )}

        {activeTab === 'notas' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Notas Emitidas</h2>
            </div>

            <TabelaDocumentos documentos={documentosFiltrados} />
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
                  <strong>{doc.documento}</strong>
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
    caixa: 'Caixa',
    despesas: 'Despesas',
    faturamento: 'Faturamento',
    imposto: 'Imposto',
    notas: 'Notas Emitidas',
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
