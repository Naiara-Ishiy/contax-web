import React, { useMemo, useState } from "react";
import styles from "./index.module.css";
import logo from '../../../assets/logoContaxCor.png';

export default function MenuMEI() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mesFiltro, setMesFiltro] = useState("2026-02");

  const [notas] = useState([]);
  const [impostosDas] = useState([]);
  const [controles] = useState([]);

  const tituloMes = useMemo(() => {
    if (!mesFiltro) return "Visão Geral";
    const [ano, mes] = mesFiltro.split("-");
    const meses = [
      "janeiro","fevereiro","março","abril","maio","junho",
      "julho","agosto","setembro","outubro","novembro","dezembro"
    ];
    return `${meses[Number(mes) - 1]} de ${ano}`;
  }, [mesFiltro]);

  const notasFiltradas = useMemo(() => {
    if (!mesFiltro) return notas;

    const [anoFiltro, mesFiltroNum] = mesFiltro.split("-");

    return notas.filter((nota) => {
      if (!nota.data) return false;
      const [, mes, ano] = nota.data.split("/");
      return ano === anoFiltro && mes === mesFiltroNum;
    });
  }, [mesFiltro, notas]);

  const totalNotas = notasFiltradas.length;

  const totalPeriodo = useMemo(() => {
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
            className={`${styles.navButton} ${activeTab === "dashboard" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`${styles.navButton} ${activeTab === "imposto" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("imposto")}
          >
            Imposto (DAS)
          </button>

          <button
            className={`${styles.navButton} ${activeTab === "notas" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("notas")}
          >
            Notas Emitidas
          </button>

          <button
            className={`${styles.navButton} ${activeTab === "controle" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("controle")}
          >
            Controle Mensal
          </button>
        </nav>

        {/* USER */}
        <div className={styles.userArea}>
          <span className={styles.userText}>Acesso: MEI</span>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className={styles.content}>
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
                  {formatCurrency(totalPeriodo)}
                </strong>
              </div>
            </div>

            {/* FILTRO */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Filtro</h2>
              </div>

              <div className={styles.filterBox}>
                <input
                  type="month"
                  value={mesFiltro}
                  onChange={(e) => setMesFiltro(e.target.value)}
                  className={styles.input}
                />

                <button className={styles.primaryButton}>
                  Aplicar
                </button>
              </div>
            </section>

            {/* VISÃO */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Resumo de {tituloMes}</h2>
              </div>

              <div className={styles.emptyBox}>
                {notasFiltradas.length === 0
                  ? "Nenhuma nota fiscal no período."
                  : "Resumo carregado com sucesso."}
              </div>
            </section>
          </>
        )}

      {activeTab === "imposto" && (
  <>
    {/* ===== RESUMO ===== */}
    <div className={styles.dashboardGrid}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Total Pago</span>
        <strong className={styles.statValue}>
          {formatCurrency(
            impostosDas
              .filter(i => i.status === "Pago")
              .reduce((acc, i) => acc + Number(i.valor || 0), 0)
          )}
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>Pendentes</span>
        <strong className={styles.statValue}>
          {impostosDas.filter(i => i.status !== "Pago").length}
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>Próximo DAS</span>
        <strong className={styles.statValue}>
          {impostosDas.length > 0 ? impostosDas[0].mes : "--"}
        </strong>
      </div>
    </div>

    {/* ===== TABELA ===== */}
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Histórico de DAS</h2>
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
                <td colSpan="4" className={styles.emptyBox}>
                  Nenhum imposto cadastrado.
                </td>
              </tr>
            ) : (
              impostosDas.map((item) => (
                <tr key={item.id}>
                  <td>{item.mes}</td>
                  <td>{item.ano}</td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        item.status === "Pago"
                          ? styles.statusPaid
                          : styles.statusPending
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>{formatCurrency(item.valor)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  </>
)}

        {/* ===== NOTAS ===== */}
{activeTab === "notas" && (
  <>
    {/* ===== RESUMO ===== */}
    <div className={styles.dashboardGrid}>
  <div className={styles.statCard}>
    <span className={styles.statLabel}>Total de notas</span>
    <strong className={styles.statValue}>{notas.length}</strong>
  </div>

  <div className={styles.statCard}>
    <span className={styles.statLabel}>Notas no mês</span>
    <strong className={styles.statValue}>
      {notasFiltradas.length}
    </strong>
  </div>
</div>

    {/* ===== TABELA ===== */}
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
                <td colSpan="4" className={styles.emptyBox}>
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
  </>
)}

{/* ===== CONTROLE ===== */}
{activeTab === "controle" && (
  <>
    {/* ===== RESUMO (TOPO) ===== */}
    <div className={styles.dashboardGrid}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Receita total</span>
        <strong className={styles.statValue}>
          {formatCurrency(
            controles.reduce((acc, item) => acc + Number(item.receita || 0), 0)
          )}
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>Total de notas</span>
        <strong className={styles.statValue}>
          {controles.reduce((acc, item) => acc + Number(item.notas || 0), 0)}
        </strong>
      </div>

      <div className={styles.statCard}>
        <span className={styles.statLabel}>Média por mês</span>
        <strong className={styles.statValue}>
          {formatCurrency(
            controles.length > 0
              ? controles.reduce((acc, item) => acc + Number(item.receita || 0), 0) /
                  controles.length
              : 0
          )}
        </strong>
      </div>
    </div>

    {/* ===== STATUS ===== */}
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Situação do negócio</h2>
      </div>

      <div className={styles.emptyBox}>
        {controles.length === 0
          ? "Sem dados suficientes para análise."
          : "Acompanhe seu crescimento mensal e identifique padrões de faturamento."}
      </div>
    </section>

    {/* ===== TABELA ===== */}
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Histórico Mensal</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>MÊS</th>
              <th>RECEITA</th>
              <th>NOTAS</th>
              <th className={styles.valueHeader}>OBSERVAÇÃO</th>
            </tr>
          </thead>

          <tbody>
            {controles.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyBox}>
                  Nenhum controle mensal cadastrado.
                </td>
              </tr>
            ) : (
              controles.map((item) => (
                <tr key={item.id}>
                  <td>{item.mes}</td>
                  <td>{formatCurrency(item.receita)}</td>
                  <td>{item.notas}</td>
                  <td className={styles.valueCell}>
                    {item.observacao || "-"}
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