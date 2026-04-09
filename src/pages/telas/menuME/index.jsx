import React, { useMemo, useState } from "react";
import styles from "./index.module.css";
import logo from '../../../assets/logo.png';

export default function MenuME() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mesFiltro, setMesFiltro] = useState("2026-02");
  const [darkMode, setDarkMode] = useState(false);

  const notas = [];

  const tituloMes = useMemo(() => {
    if (!mesFiltro) return "Visão Geral";
    const [ano, mes] = mesFiltro.split("-");
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    return `Visão Geral—${meses[Number(mes) - 1]} de ${ano}`;
  }, [mesFiltro]);

  const notasFiltradas = useMemo(() => {
    if (!mesFiltro) return notas;

    const [anoFiltro, mesFiltroNum] = mesFiltro.split("-");

    return notas.filter((nota) => {
      const [dia, mes, ano] = nota.data.split("/");
      return ano === anoFiltro && mes === mesFiltroNum;
    });
  }, [mesFiltro, notas]);

  const totalPeriodo = useMemo(() => {
    return notasFiltradas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [notasFiltradas]);

  return (
    <div className={`${styles.page} ${darkMode ? styles.pageDark : ""}`}>
      <header className={styles.topbar}>
        <div className={styles.leftHeader}>
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
                activeTab === "dashboard" ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === "caixa" ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveTab("caixa")}
            >
              Caixa
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === "despesas" ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveTab("despesas")}
            >
              Despesas
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === "faturamento" ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveTab("faturamento")}
            >
              Faturamento
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === "imposto" ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveTab("imposto")}
            >
              Imposto
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === "notas" ? styles.navButtonActive : ""
              }`}
              onClick={() => setActiveTab("notas")}
            >
              Notas Emitidas
            </button>
          </nav>
        </div>

        <div className={styles.rightHeader}>
          <span className={styles.userText}>Acesso: teste me</span>

          <button
            className={styles.moonButton}
            onClick={() => setDarkMode((prev) => !prev)}
            title="Alternar tema"
          >
            🌙
          </button>

          <div className={styles.userBadge} />
        </div>
      </header>

      <main className={styles.content}>
        {activeTab === "dashboard" && (
          <>
            <div className={styles.topGrid}>
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>{tituloMes}</h2>
                </div>

                <div className={styles.cardBodyLarge}>
                  {notasFiltradas.length === 0 ? (
                    <p className={styles.emptyText}>Nenhuma nota fiscal no período.</p>
                  ) : (
                    <div className={styles.summaryInfo}>
                      <div className={styles.summaryItem}>
                        <span>Total de notas</span>
                        <strong>{notasFiltradas.length}</strong>
                      </div>

                      <div className={styles.summaryItem}>
                        <span>Faturamento do período</span>
                        <strong>{formatCurrency(totalPeriodo)}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className={`${styles.card} ${styles.filterCard}`}>
                <div className={styles.cardHeader}>
                  <h2>Filtro</h2>
                </div>

                <div className={styles.filterBody}>
                  <div className={styles.field}>
                    <label>Mes</label>
                    <input
                      type="month"
                      value={mesFiltro}
                      onChange={(e) => setMesFiltro(e.target.value)}
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
                      <th className={styles.valueHeader}>Valor (R$)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {notasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="4" className={styles.emptyTable}></td>
                      </tr>
                    ) : (
                      notasFiltradas.map((nota) => (
                        <tr key={nota.id}>
                          <td>{nota.data}</td>
                          <td>{nota.empresa}</td>
                          <td>{nota.descricao}</td>
                          <td className={styles.valueCell}>
                            {formatCurrency(nota.valor)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === "caixa" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Caixa</h2>
            </div>

            <div className={styles.placeholderBody}>
              <div className={styles.placeholderText}>
                Área de caixa pronta para integrar entradas, saídas e saldo atual.
              </div>
            </div>
          </section>
        )}

        {activeTab === "despesas" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Despesas</h2>
            </div>

            <div className={styles.placeholderBody}>
              <div className={styles.placeholderText}>
                Área de despesas pronta para cadastro e listagem.
              </div>
            </div>
          </section>
        )}

        {activeTab === "faturamento" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Faturamento</h2>
            </div>

            <div className={styles.placeholderBody}>
              <div className={styles.placeholderText}>
                Área de faturamento pronta para gráficos, totais e metas.
              </div>
            </div>
          </section>
        )}

        {activeTab === "imposto" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Imposto</h2>
            </div>

            <div className={styles.placeholderBody}>
              <div className={styles.placeholderText}>
                Área de impostos pronta para cálculos e acompanhamento.
              </div>
            </div>
          </section>
        )}

        {activeTab === "notas" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Notas Emitidas</h2>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>DATA</th>
                    <th>EMPRESA</th>
                    <th>DESCRIÇÃO</th>
                    <th className={styles.valueHeader}>Valor (R$)</th>
                  </tr>
                </thead>

                <tbody>
                  {notas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyTable}>
                        Nenhuma nota emitida cadastrada.
                      </td>
                    </tr>
                  ) : (
                    notas.map((nota) => (
                      <tr key={nota.id}>
                        <td>{nota.data}</td>
                        <td>{nota.empresa}</td>
                        <td>{nota.descricao}</td>
                        <td className={styles.valueCell}>
                          {formatCurrency(nota.valor)}
                        </td>
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
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}