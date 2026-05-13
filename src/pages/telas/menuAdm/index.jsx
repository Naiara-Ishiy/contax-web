import React, { useMemo, useState, useEffect } from "react";
import styles from "./index.module.css";
import api from "../../../services/apis";

import logo from '../../../assets/logoContaxCor.png';

export default function MenuAdm() {
  const [activeTab, setActiveTab] = useState("notas");
  const [isAdmin] = useState(true);

  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const buscarEmpresas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/empresas`);

      console.log("RESPOSTA:", response.data);

      setEmpresas(response.data.dados || []);
    } catch (err) {
      console.log(err);
      setEmpresas([]);
      setError("Erro ao carregar empresas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarEmpresas();
  }, []);

  const [empresaForm, setEmpresaForm] = useState({
    emp_nome_fantasia: "",
    emp_razao_social: "",
    emp_cnpj: "",
    emp_endereco: "",
    emp_municipio: "",
    emp_telefone: "",
    emp_email: "",
    emp_senha: "",
    emp_tipo: 0,
  });

  const [notaForm, setNotaForm] = useState({
    empresa: "",
    data: "",
    valor: "",
    descricao: "",
  });

  const [usuarioForm, setUsuarioForm] = useState({
    usu_nome: "",
    usu_email: "",
    usu_cpf: "",
    usu_senha: "",
    usu_telefone: "",
    usu_status: 1,
    usu_alterar_senha: 0,
  });

  const [notas, setNotas] = useState([]);

  const totalEmpresas = empresas?.length || 0;
  const totalNotas = notas.length;
  const totalUsuarios = usuarios.length;

  const totalFaturado = useMemo(() => {
    return notas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  }, [notas]);

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaForm((prev) => ({
      ...prev,
      [name]: name === "emp_tipo" ? Number(value) : value,
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
      [name]: 
        name === "usu_status"
          ? Number(value)
          : value,
    }));
  };

  const cadastrarEmpresa = (e) => {
    e.preventDefault();

    if (!empresaForm.emp_nome_fantasia.trim()) return;

    const novaEmpresa = {
      emp_id: Date.now(),
      emp_nome_fantasia: empresaForm.emp_nome_fantasia.trim(),
      emp_cnpj: empresaForm.emp_cnpj.trim(),
      emp_tipo: empresaForm.emp_tipo,
    };

    setEmpresas((prev) => [...prev, novaEmpresa]);

  setEmpresaForm({
     emp_nome_fantasia: "",
     emp_razao_social: "",
     emp_cnpj: "",
     emp_endereco: "",
     emp_municipio: "",
     emp_telefone: "",
     emp_email: "",
     emp_senha: "",
     emp_tipo: 0,
  });
};

  const cadastrarUsuario = (e) => {
    e.preventDefault();

    if (
      !usuarioForm.usu_nome.trim() ||
      !usuarioForm.usu_email.trim() ||
      !usuarioForm.usu_cpf.trim() ||
      !usuarioForm.usu_senha.trim() ||
      !usuarioForm.usu_telefone.trim()
    ) {
      return;
    }

    const novoUsuario = {
      usu_id: Date.now(),
      usu_nome: usuarioForm.usu_nome.trim(),
      usu_email: usuarioForm.usu_email.trim(),
      usu_cpf: usuarioForm.usu_cpf.trim(),
      usu_senha: usuarioForm.usu_senha,
      usu_telefone: usuarioForm.usu_telefone.trim(),
      usu_status: usuarioForm.usu_status,
      usu_alterar_senha: 0,
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
      (empresa) => String(empresa.emp_id) === notaForm.empresa
    );

    const novaNota = {
      id: Date.now(),
      data: formatDateBR(notaForm.data),
      empresa_id: empresaSelecionada?.emp_id || null,
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
    const empresaRemovida = empresas.find((item) => item.emp_id === id);

    setEmpresas((prev) => prev.filter((empresa) => empresa.emp_id !== id));

    if (empresaRemovida) {
      setNotas((prev) =>
        prev.filter((nota) => nota.empresa !== empresaRemovida.emp_nome_fantasia)
      );
    }
  };

  const excluirUsuario = (id) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
  };

  if (loading && empresas.length === 0) {
  return <p>Carregando empresas...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
  <div className={styles.topbarInner}>

    {/* LOGO */}
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

    {/* USER */}
    <div className={styles.userArea}>
      <span className={styles.userText}>Acesso: Administrador</span>
    </div>

  </div>
</header>

      <main className={styles.content}>
        {activeTab === "dashboard" && (
        <>
      <div className={styles.dashboardLayout}>

      {/* ESQUERDA */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Visão Geral</h2>
        </div>

        {empresas.length === 0 ? (
          <div className={styles.emptyBox}>
            Nenhuma empresa cadastrada.
          </div>
        ) : (
          empresas.map((empresa) => {
            const notasEmpresa = notas.filter(
              (n) => n.empresa === empresa.emp_id
            );

            const total = notasEmpresa.reduce(
              (acc, n) => acc + Number(n.valor || 0),
              0
            );

            const limite = 20000;
            const percentual = Math.min((total / limite) * 100, 100);

            const status =
              percentual < 50
                ? "Saudável"
                : percentual < 80
                ? "Atenção"
                : "Risco";

            return (
              <div key={empresa.emp_id} className={styles.companyCard}>
                
                <div className={styles.companyTop}>
                  <span className={styles.typeBadge}>
                    {Number(empresa.emp_tipo) === 0 ? "ME" : "MEI"}
                  </span>

                  <span className={styles.monthBadge}>
                    {new Date().toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className={styles.companyContent}>
                  
                  <div>
                    <div className={styles.companyName}>
                      <span className={styles.dot}></span>
                      <strong>{empresa.emp_nome_fantasia}</strong>
                    </div>

                    <p className={styles.limitText}>
                      Limite: <strong>{formatCurrency(limite)}</strong> •
                      Utilizado: <strong>{formatCurrency(total)}</strong> •
                      Restante:{" "}
                      <strong>{formatCurrency(limite - total)}</strong>
                    </p>
                  </div>

                  <div className={styles.progressArea}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${percentual}%` }}
                      />
                    </div>

                    <strong className={styles.percent}>
                      {percentual.toFixed(1)}%
                    </strong>

                    <span
                      className={styles.statusBadge}
                      style={{
                        background:
                          status === "Saudável"
                            ? "#d9f8e8"
                            : status === "Atenção"
                            ? "#fff4d6"
                            : "#ffe4e6",
                        color:
                          status === "Saudável"
                            ? "#047857"
                            : status === "Atenção"
                            ? "#b45309"
                            : "#b91c1c",
                      }}
                    >
                      {status}
                    </span>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </section>

      {/* DIREITA */}
      <section className={`${styles.card} ${styles.filterCard}`}>
        <div className={styles.cardHeader}>
          <h2>Filtro</h2>
        </div>

        <div className={styles.filterBody}>
          <div className={styles.field}>
            <label>Mês</label>
            <input type="month" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label>Empresa</label>
            <select className={styles.input}>
              <option value="">Todas</option>
              {empresas.map((e) => (
                <option key={e.emp_id}>{e.emp_nome_fantasia}</option>
              ))}
            </select>
          </div>

          <button className={styles.primaryButton}>
            Aplicar
          </button>
        </div>
      </section>
    </div>

    {/* TABELA */}
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Notas Fiscais</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>DATA</th>
              <th>EMPRESA</th>
              <th>DESCRIÇÃO</th>
              <th>VALOR</th>
            </tr>
          </thead>

          <tbody>
            {notas.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyTable}>
                  Nenhuma nota cadastrada.
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
                    name="emp_nome_fantasia"
                    value={empresaForm.emp_nome_fantasia}
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
                      name="emp_cnpj"
                      value={empresaForm.emp_cnpj}
                      onChange={handleEmpresaChange}
                      className={styles.input}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Tipo</label>
                    <select
                      name="emp_tipo"
                      value={empresaForm.emp_tipo}
                      onChange={handleEmpresaChange}
                      className={styles.input}
                    >
                      <option value={0}>ME</option>
                      <option value={1}>MEI</option>
                    </select>
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
                        <tr key={empresa.emp_id}>
                          <td>{empresa.emp_nome_fantasia}</td>
                          <td>{empresa.emp_cnpj || "-"}</td>
                          <td>{Number(empresa.emp_tipo) === 0 ? "ME" : "MEI"}</td>
                          <td>
                            <button
                              className={styles.actionButton}
                              onClick={() => excluirEmpresa(empresa.emp_id)}
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
                    name="usu_nome"
                    value={usuarioForm.usu_nome}
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
                      name="usu_email"
                      value={usuarioForm.usu_email}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>CPF ou CRC</label>
                    <input
                      type="text"
                      name="usu_cpf"
                      value={usuarioForm.usu_cpf}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="Digite o documento"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Telefone</label>
                    <input
                      type="text"
                      name="usu_telefone"
                      value={usuarioForm.usu_telefone}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Senha</label>
                    <input
                      type="password"
                      name="usu_senha"
                      value={usuarioForm.usu_senha}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                      placeholder="Digite a senha"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Status</label>
                    <select
                      name="usu_status"
                      value={usuarioForm.usu_status}
                      onChange={handleUsuarioChange}
                      className={styles.input}
                    >
                      <option value={1}>Ativo</option>
                      <option value={0}>Inativo</option>
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
                          <td>{usuario.usu_nome}</td>
                          <td>{usuario.usu_email}</td>
                          <td>{usuario.usu_cpf}</td>
                          <td>{usuario.usu_telefone}</td>
                          <td>{usuario.usu_status ? "Ativo" : "Inativo"}</td>
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
                      <option key={empresa.emp_id} value={empresa.emp_id}>
                        {empresa.emp_nome_fantasia}
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