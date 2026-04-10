import React, { useMemo, useState } from "react";
import styles from "./index.module.css";
import logo from '../../../assets/logo.png';

export default function MenuAdm() {
  const [activeTab, setActiveTab] = useState("notas");
  const [isAdmin] = useState(true);

  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [empresaForm, setEmpresaForm] = useState({
    nome: "",
    cnpj: "",
    categoria: "",
  });

  const [notaForm, setNotaForm] = useState({
    empresa: "",
    data: "",
    valor: "",
    descricao: "",
  });

  const [usuarioForm, setUsuarioForm] = useState({
    nome: "",
    email: "",
    documento: "",
    senha: "",
    tipo: "Contabilista",
    status: "Ativo",
  });

  const [notas, setNotas] = useState([]);

  const totalEmpresas = empresas.length;
  const totalNotas = notas.length;
  const totalUsuarios = usuarios.length;

  const totalFaturado = useMemo(() => {
    return notas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [notas]);

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotaChange = (e) => {
    const { name, value } = e.target;
    setNotaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuarioForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cadastrarEmpresa = (e) => {
    e.preventDefault();

    if (!empresaForm.nome.trim()) return;

    const novaEmpresa = {
      id: Date.now(),
      nome: empresaForm.nome.trim(),
      cnpj: empresaForm.cnpj.trim(),
      categoria: empresaForm.categoria.trim(),
    };

    setEmpresas((prev) => [...prev, novaEmpresa]);

    setEmpresaForm({
      nome: "",
      cnpj: "",
      categoria: "",
    });
  };

  const cadastrarUsuario = (e) => {
    e.preventDefault();

    if (
      !usuarioForm.nome.trim() ||
      !usuarioForm.email.trim() ||
      !usuarioForm.documento.trim() ||
      !usuarioForm.senha.trim()
    ) {
      return;
    }

    const novoUsuario = {
      id: Date.now(),
      nome: usuarioForm.nome.trim(),
      email: usuarioForm.email.trim(),
      documento: usuarioForm.documento.trim(),
      senha: usuarioForm.senha,
      tipo: usuarioForm.tipo,
      status: usuarioForm.status,
    };

    setUsuarios((prev) => [...prev, novoUsuario]);

    setUsuarioForm({
      nome: "",
      email: "",
      documento: "",
      senha: "",
      tipo: "Contabilista",
      status: "Ativo",
    });
  };

  const lancarNota = (e) => {
    e.preventDefault();

    if (
      !notaForm.empresa ||
      !notaForm.data ||
      !notaForm.valor ||
      !notaForm.descricao.trim()
    ) {
      return;
    }

    const empresaSelecionada = empresas.find(
      (empresa) => String(empresa.id) === notaForm.empresa
    );

    const novaNota = {
      id: Date.now(),
      data: formatDateBR(notaForm.data),
      empresa: empresaSelecionada?.nome || "",
      descricao: notaForm.descricao.trim(),
      valor: Number(notaForm.valor),
    };

    setNotas((prev) => [novaNota, ...prev]);

    setNotaForm({
      empresa: "",
      data: "",
      valor: "",
      descricao: "",
    });
  };

  const excluirNota = (id) => {
    setNotas((prev) => prev.filter((nota) => nota.id !== id));
  };

  const excluirEmpresa = (id) => {
    const empresaRemovida = empresas.find((item) => item.id === id);

    setEmpresas((prev) => prev.filter((empresa) => empresa.id !== id));

    if (empresaRemovida) {
      setNotas((prev) =>
        prev.filter((nota) => nota.empresa !== empresaRemovida.nome)
      );
    }
  };

  const excluirUsuario = (id) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
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
              activeTab === "empresas" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActiveTab("empresas")}
          >
            Empresas
          </button>

          <button
            className={`${styles.navButton} ${
              activeTab === "usuarios" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActiveTab("usuarios")}
          >
            Usuários
          </button>

          <button
            className={`${styles.navButton} ${
              activeTab === "notas" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActiveTab("notas")}
          >
            Notas Fiscais
          </button>
        </nav>

        <div className={styles.userArea}>
          <span className={styles.userText}>Acesso: Administrador</span>
          <div className={styles.userBadge} />
        </div>
      </header>

      <main className={styles.content}>
        {activeTab === "dashboard" && (
          <>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Dashboard Administrativo</h2>
              </div>

              <div className={styles.dashboardGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Empresas cadastradas</span>
                  <strong className={styles.statValue}>{totalEmpresas}</strong>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Usuários cadastrados</span>
                  <strong className={styles.statValue}>{totalUsuarios}</strong>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Notas lançadas</span>
                  <strong className={styles.statValue}>{totalNotas}</strong>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total faturado</span>
                  <strong className={styles.statValue}>
                    {formatCurrency(totalFaturado)}
                  </strong>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Resumo rápido</h2>
              </div>

              <div className={styles.emptyBox}>
                {empresas.length === 0 && usuarios.length === 0 && notas.length === 0
                  ? "Nenhum dado cadastrado ainda."
                  : "Use as abas de Empresas, Usuários e Notas Fiscais para gerenciar o sistema."}
              </div>
            </section>
          </>
        )}

        {activeTab === "empresas" && (
          <>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Cadastrar Empresa</h2>
              </div>

              <form className={styles.form} onSubmit={cadastrarEmpresa}>
                <div className={styles.field}>
                  <label>Nome da empresa</label>
                  <input
                    type="text"
                    name="nome"
                    value={empresaForm.nome}
                    onChange={handleEmpresaChange}
                    className={styles.input}
                    placeholder="Digite o nome da empresa"
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>CNPJ</label>
                    <input
                      type="text"
                      name="cnpj"
                      value={empresaForm.cnpj}
                      onChange={handleEmpresaChange}
                      className={styles.input}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Categoria</label>
                    <input
                      type="text"
                      name="categoria"
                      value={empresaForm.categoria}
                      onChange={handleEmpresaChange}
                      className={styles.input}
                      placeholder="Ex: Comércio, Serviços..."
                    />
                  </div>
                </div>

                <button type="submit" className={styles.primaryButton}>
                  Cadastrar Empresa
                </button>
              </form>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Empresas cadastradas</h2>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CNPJ</th>
                      <th>Categoria</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {empresas.length === 0 ? (
                      <tr>
                        <td colSpan="4" className={styles.emptyTable}>
                          Nenhuma empresa cadastrada.
                        </td>
                      </tr>
                    ) : (
                      empresas.map((empresa) => (
                        <tr key={empresa.id}>
                          <td>{empresa.nome}</td>
                          <td>{empresa.cnpj || "-"}</td>
                          <td>{empresa.categoria || "-"}</td>
                          <td>
                            <button
                              className={styles.actionButton}
                              onClick={() => excluirEmpresa(empresa.id)}
                            >
                              Excluir
                            </button>
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

        {activeTab === "usuarios" && (
          <>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Cadastrar Usuário (Contabilista)</h2>
              </div>

              <form className={styles.form} onSubmit={cadastrarUsuario}>
                <div className={styles.field}>
                  <label>Nome completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={usuarioForm.nome}
                    onChange={handleUsuarioChange}
                    className={styles.input}
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={usuarioForm.email}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>CPF ou CRC</label>
                    <input
                      type="text"
                      name="documento"
                      value={usuarioForm.documento}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="Digite o documento"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Senha</label>
                    <input
                      type="password"
                      name="senha"
                      value={usuarioForm.senha}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="Digite a senha"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Status</label>
                    <select
                      name="status"
                      value={usuarioForm.status}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Tipo de acesso</label>
                  <input
                    type="text"
                    name="tipo"
                    value={usuarioForm.tipo}
                    onChange={handleUsuarioChange}
                    className={styles.input}
                    readOnly
                  />
                </div>

                <button type="submit" className={styles.primaryButton}>
                  Cadastrar Usuário
                </button>
              </form>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Usuários cadastrados</h2>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Documento</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={styles.emptyTable}>
                          Nenhum usuário cadastrado.
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.nome}</td>
                          <td>{usuario.email}</td>
                          <td>{usuario.documento}</td>
                          <td>{usuario.tipo}</td>
                          <td>{usuario.status}</td>
                          <td>
                            <button
                              className={styles.actionButton}
                              onClick={() => excluirUsuario(usuario.id)}
                            >
                              Excluir
                            </button>
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

        {activeTab === "notas" && (
          <>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Lançar Nota Fiscal (apenas Admin)</h2>
              </div>

              <form className={styles.form} onSubmit={lancarNota}>
                <div className={styles.field}>
                  <label>Empresa</label>
                  <select
                    name="empresa"
                    value={notaForm.empresa}
                    onChange={handleNotaChange}
                    className={styles.input}
                    disabled={!isAdmin}
                  >
                    <option value="">Selecione uma empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Data</label>
                    <input
                      type="date"
                      name="data"
                      value={notaForm.data}
                      onChange={handleNotaChange}
                      className={styles.input}
                      disabled={!isAdmin}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Valor (R$)</label>
                    <input
                      type="number"
                      name="valor"
                      value={notaForm.valor}
                      onChange={handleNotaChange}
                      className={styles.input}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      disabled={!isAdmin}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Descrição</label>
                  <input
                    type="text"
                    name="descricao"
                    value={notaForm.descricao}
                    onChange={handleNotaChange}
                    className={styles.input}
                    placeholder="Serviço, venda, etc."
                    disabled={!isAdmin}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={!isAdmin || empresas.length === 0}
                >
                  Lançar Nota
                </button>
              </form>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Notas Fiscais (todas)</h2>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Empresa</th>
                      <th>Descrição</th>
                      <th>Valor (R$)</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {notas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className={styles.emptyTable}>
                          Nenhuma nota fiscal lançada.
                        </td>
                      </tr>
                    ) : (
                      notas.map((nota) => (
                        <tr key={nota.id}>
                          <td>{nota.data}</td>
                          <td>{nota.empresa}</td>
                          <td>{nota.descricao}</td>
                          <td>{formatCurrency(nota.valor)}</td>
                          <td>
                            <button
                              className={styles.actionButton}
                              onClick={() => excluirNota(nota.id)}
                            >
                              Excluir
                            </button>
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

function formatDateBR(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}