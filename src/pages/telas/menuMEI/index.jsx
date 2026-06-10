import React, { useMemo, useState } from 'react';
import styles from './index.module.css';
import logo from '../../../assets/logoContaxCor.png';

export default function MenuMEI() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filtroMes, setFiltroMes] = useState('');

  const [notas] = useState([]);
  const [impostosDas] = useState([]);
  const [controles] = useState([]);

  const notasFiltradas = useMemo(() => {
    if (!filtroMes) return notas;
    return notas.filter((nota) => nota.data?.includes(filtroMes));
  }, [notas, filtroMes]);

  const totalNotas = notasFiltradas.length;

  const totalFaturado = useMemo(() => {
    return notasFiltradas.reduce((acc, nota) => acc + Number(nota.valor || 0), 0);
  }, [notasFiltradas]);

  const tituloMes = filtroMes ? `Visão Geral — ${formatMonthBR(filtroMes)}` : 'Visão Geral';

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
            <button
              className={`${styles.navButton} ${
                activeTab === 'dashboard' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === 'imposto' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('imposto')}
            >
              Imposto (DAS)
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === 'notas' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('notas')}
            >
              Notas Emitidas
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === 'controle' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('controle')}
            >
              Controle Mensal
            </button>
          </nav>

          <div className={styles.userArea}>
            <span className={styles.userText}>Acesso: MEI</span>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {activeTab === 'dashboard' && (
          <>
            <div className={styles.dashboardLayout}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>{tituloMes}</h2>
                </div>

                <div className={styles.companyCard}>
                  <div className={styles.companyTop}>
                    <span className={styles.typeBadge}>MEI</span>
                    <span className={styles.monthBadge}>
                      {filtroMes ? formatMonthBR(filtroMes) : 'Mês atual'}
                    </span>
                  </div>

                  <div className={styles.companyContent}>
                    <div>
                      <div className={styles.companyName}>
                        <span className={styles.dot}></span>
                        <strong>Empresa MEI</strong>
                      </div>

                      <p className={styles.limitText}>
                        Limite: <strong>R$ 6.750,00</strong> • Utilizado:{' '}
                        <strong>{formatCurrency(totalFaturado)}</strong> • Restante:{' '}
                        <strong>{formatCurrency(6750 - totalFaturado)}</strong>
                      </p>
                    </div>

                    <div className={styles.progressArea}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${Math.min((totalFaturado / 6750) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>

                      <strong className={styles.percent}>
                        {((totalFaturado / 6750) * 100).toFixed(1)}%
                      </strong>

                      <span className={styles.statusBadge}>Saudável</span>
                    </div>
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

                  <button className={styles.applyButton}>Aplicar</button>
                </div>
              </section>
            </div>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Notas Fiscais do período</h2>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>DATA</th>
                      <th>EMPRESA</th>
                      <th>DESCRIÇÃO</th>
                      <th className={styles.valueHeader}>VALOR (R$)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {notasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="4" className={styles.emptyTableText}>
                          Sem notas neste período.
                        </td>
                      </tr>
                    ) : (
                      notasFiltradas.map((nota) => (
                        <tr key={nota.id}>
                          <td>{nota.data}</td>
                          <td>{nota.empresa}</td>
                          <td>{nota.descricao}</td>
                          <td>{formatCurrency(nota.valor)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'imposto' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Imposto (DAS)</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Ano</th>
                    <th>Status</th>
                    <th>Valor</th>
                  </tr>
                </thead>

                <tbody>
                  {impostosDas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyTableText}>
                        Nenhum imposto cadastrado.
                      </td>
                    </tr>
                  ) : (
                    impostosDas.map((item) => (
                      <tr key={item.id}>
                        <td>{item.mes}</td>
                        <td>{item.ano}</td>
                        <td>{item.status}</td>
                        <td>{formatCurrency(item.valor)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'notas' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Notas Emitidas</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Empresa</th>
                    <th>Descrição</th>
                    <th>Valor (R$)</th>
                  </tr>
                </thead>

                <tbody>
                  {notas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyTableText}>
                        Nenhuma nota emitida cadastrada.
                      </td>
                    </tr>
                  ) : (
                    notas.map((nota) => (
                      <tr key={nota.id}>
                        <td>{nota.data}</td>
                        <td>{nota.empresa}</td>
                        <td>{nota.descricao}</td>
                        <td>{formatCurrency(nota.valor)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'controle' && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Controle Mensal</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Receita</th>
                    <th>Notas</th>
                    <th>Observação</th>
                  </tr>
                </thead>

                <tbody>
                  {controles.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyTableText}>
                        Nenhum controle mensal cadastrado.
                      </td>
                    </tr>
                  ) : (
                    controles.map((item) => (
                      <tr key={item.id}>
                        <td>{item.mes}</td>
                        <td>{formatCurrency(item.receita)}</td>
                        <td>{item.notas}</td>
                        <td>{item.observacao || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatMonthBR(value) {
  if (!value) return '';

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
