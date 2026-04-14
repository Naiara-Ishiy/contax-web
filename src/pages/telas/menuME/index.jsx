import React, { useState, useMemo } from "react";
import styles from "./index.module.css";
import logo from "../../../assets/logo2.png";

export default function MenuME() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [notas, setNotas] = useState([]);
  const [filtroMes, setFiltroMes] = useState("");

  // ===== FILTRO =====
  const notasFiltradas = useMemo(() => {
    if (!filtroMes) return notas;

    return notas.filter((nota) => nota.data?.includes(filtroMes));
  }, [notas, filtroMes]);

  // ===== RESUMO =====
  const totalNotas = notasFiltradas.length;

  const totalFaturado = useMemo(() => {
    return notasFiltradas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [notasFiltradas]);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.topbar}>
        <div className={styles.logoArea}>
          <img src={logo} alt="Contax" className={styles.logoImg} />

          <div className={styles.logoText}>
            <h1 className={styles.brand}>CONTAX</h1>
            <span className={styles.brandSubtitle}>
              ME & MEI - Dashboard
            </span>
          </div>
        </div>

        {/* NAV */}
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

        {/* USER */}
        <div className={styles.userArea}>
          <span className={styles.userText}>Acesso: ME</span>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className={styles.content}>
        {/* ===== DASHBOARD ===== */}
        {activeTab === "dashboard" && (
          <>
            <div className={styles.dashboardGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Notas no período</span>
                <strong className={styles.statValue}>{totalNotas}</strong>
              </div>

              <div className={styles.statCard}>
                <span className={styles.statLabel}>Faturamento</span>
                <strong className={styles.statValue}>
                  {formatCurrency(totalFaturado)}
                </strong>
              </div>
            </div>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Visão Geral</h2>
              </div>

              <div className={styles.emptyBox}>
                {notas.length === 0
                  ? "Nenhuma nota fiscal no período."
                  : "Utilize os filtros para refinar os resultados."}
              </div>
            </section>
          </>
        )}

        {/* ===== CAIXA ===== */}
        {activeTab === "caixa" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Caixa</h2>
            </div>

            <div className={styles.emptyBox}>
              Área de caixa pronta para integrar entradas, saídas e saldo atual.
            </div>
          </section>
        )}

        {/* ===== DESPESAS ===== */}
        {activeTab === "despesas" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Despesas</h2>
            </div>

            <div className={styles.emptyBox}>
              Área de despesas pronta para cadastro e listagem.
            </div>
          </section>
        )}

        {/* ===== FATURAMENTO ===== */}
        {activeTab === "faturamento" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Faturamento</h2>
            </div>

            <div className={styles.emptyBox}>
              Área de faturamento pronta para gráficos, totais e metas.
            </div>
          </section>
        )}

        {/* ===== IMPOSTO ===== */}
        {activeTab === "imposto" && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Imposto</h2>
            </div>

            <div className={styles.emptyBox}>
              Área de impostos pronta para cálculos e acompanhamento.
            </div>
          </section>
        )}

        {/* ===== NOTAS ===== */}
        {activeTab === "notas" && (
          <>
            {/* FILTRO */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Filtro</h2>
              </div>

              <div className={styles.filterBox}>
                <input
                  type="month"
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className={styles.input}
                />

                <button className={styles.primaryButton}>
                  Aplicar
                </button>
              </div>
            </section>

            {/* TABELA */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Notas Fiscais do período</h2>
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
                    {notasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="4" className={styles.emptyBox}>
                          Nenhuma nota fiscal encontrada.
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
      </main>
    </div>
  );
}

/* ===== HELPERS ===== */

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}