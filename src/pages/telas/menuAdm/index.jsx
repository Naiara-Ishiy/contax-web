import React, { useMemo, useState, useEffect } from 'react';
import { Users, Building2, FileText, DollarSign, User } from 'lucide-react';
import styles from './index.module.css';
import api from '../../../services/apis';

import logo from '../../../assets/logoContaxCor.png';

import { usuariosService } from '../../../services/usuariosService';
import { empresasService } from '../../../services/empresasService';

export default function MenuAdm() {
  const [activeTab, setActiveTab] = useState('notas');
  const isAdmin = true;

  const [adminResumo, setAdminResumo] = useState(null);
  const [financeiroMensal, setFinanceiroMensal] = useState(null);
  const [empresaModal, setEmpresaModal] = useState(null)
  const [empresasRisco, setEmpresasRisco] = useState([]);
  const [notasRecentes, setNotasRecentes] = useState([]);
  const [prazosPendentes, setPrazosPendentes] = useState([]);
  const [auditoriaRecente, setAuditoriaRecente] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    ativo: false,
    titulo: '',
    mensagem: '',
  });

  const buscarDashboardAdmin = async () => {
    try {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = hoje.getMonth() + 1;

      const [
        resumoResponse,
        financeiroResponse,
        empresasRiscoResponse,
        ultimosDocumentosResponse,
        prazosResponse,
        auditoriaResponse,
      ] = await Promise.all([
        api.get('/admin/resumo'),
        api.get(`/admin/financeiro-mensal?ano=${ano}&mes=${mes}`),
        api.get('/admin/empresas-risco'),
        api.get('/admin/ultimos-documentos?limit=10'),
        api.get('/admin/prazos-pendentes'),
        api.get('/admin/auditoria-recente?limit=5'),
      ]);

      setAdminResumo(resumoResponse.data.dados || null);
      setFinanceiroMensal(financeiroResponse.data.dados || null);
      setEmpresasRisco(empresasRiscoResponse.data.dados || []);
      setNotasRecentes(ultimosDocumentosResponse.data.dados || []);
      setPrazosPendentes(prazosResponse.data.dados || []);
      setAuditoriaRecente(auditoriaResponse.data.dados || []);
    } catch (err) {
      console.log(err);
      setError('Erro ao carregar dados do dashboard administrativo');
    }
  };

  const buscarEmpresas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/empresas`);

      console.log('RESPOSTA:', response.data);

      setEmpresas(response.data.dados || []);
    } catch (err) {
      console.log(err);
      setEmpresas([]);
      setError('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuarios = async () => {
    try {
      setLoading(true);
      // Dentro da função buscarUsuarios no MenuAdm.js
      const response = await usuariosService.listar();
      setUsuarios(response.dados || []); 
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarNotas = async () => {
    try {
      setLoading(true);

      const empresaSalva = JSON.parse(localStorage.getItem('empresa'));

      const response = await api.get(`/documentos?emp_id=${empresaSalva?.emp_id || empresaSalva?.id || 1}`);

      console.log('DOCUMENTOS:', JSON.stringify(response.data));

      setNotas(response.data.dados || []);
    } catch (err) {
      console.log(err);
      setNotas([]);
      setError('Erro ao carregar notas fiscais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarEmpresas();
    buscarUsuarios();
    buscarNotas();
    buscarDashboardAdmin();
  }, []);

  const mostrarFeedback = (titulo, mensagem) => {
    setFeedback({
      ativo: true,
      titulo,
      mensagem,
    });
  };

  const [empresaForm, setEmpresaForm] = useState({
    emp_nome_fantasia: '',
    emp_razao_social: '',
    emp_cnpj: '',
    emp_endereco: '',
    emp_municipio: '',
    emp_telefone: '',
    emp_email: '',
    emp_senha: '',
    emp_tipo: 0,
  });

  const [notaForm, setNotaForm] = useState({
    empresa: '',
    data: '',
    valor: '',
    descricao: '',
  });

  const [usuarioForm, setUsuarioForm] = useState({
    usu_nome: '',
    usu_email: '',
    usu_cpf: '',
    usu_senha: '',
    usu_telefone: '',
    usu_status: 1,
    usu_alterar_senha: 0,
    tipo_acesso: '',
    empresa_vinculada: '',
  });

  const totalFaturadoLocal = useMemo(() => {
    return notas.reduce((acc, item) => acc + Number(item.fin_valor_total || 0), 0);
  }, [notas]);

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaForm((prev) => ({
      ...prev,
      [name]: name === 'emp_tipo' ? Number(value) : value,
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
      [name]: name === 'usu_status' ? Number(value) : value,
    }));
  };

  const cadastrarEmpresa = (e) => {
    e.preventDefault();

    if (!empresaForm.emp_nome_fantasia.trim() || !empresaForm.emp_cnpj.trim()) {
      mostrarFeedback(
        'Campos obrigatórios',
        'Preencha todos os campos antes de cadastrar a empresa.'
      );
      return;
    }

    const novaEmpresa = {
      emp_id: Date.now(),
      emp_nome_fantasia: empresaForm.emp_nome_fantasia.trim(),
      emp_cnpj: empresaForm.emp_cnpj.trim(),
      emp_tipo: empresaForm.emp_tipo,
    };

    setEmpresas((prev) => [...prev, novaEmpresa]);

    setEmpresaForm({
      emp_nome_fantasia: '',
      emp_razao_social: '',
      emp_cnpj: '',
      emp_endereco: '',
      emp_municipio: '',
      emp_telefone: '',
      emp_email: '',
      emp_senha: '',
      emp_tipo: 0,
    });
  };

const cadastrarUsuario = async (e) => {
    e.preventDefault();

    // Objeto formatado exatamente como o 'request.body' do seu controller espera
    const dadosParaEnviar = {
      nome: usuarioForm.usu_nome,
      email: usuarioForm.usu_email,
      cpf: usuarioForm.usu_cpf,
      senha: usuarioForm.usu_senha,
      telefone: usuarioForm.usu_telefone,
      alterar_senha: Number(usuarioForm.usu_alterar_senha) || 0,
      emp_id: Number(usuarioForm.empresa_vinculada), 
      nivel_acesso: Number(usuarioForm.tipo_acesso),
      data_vinculo: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      observacoes: 'Cadastro via MenuAdm' // Campo obrigatório no seu código
    };

    try {
      console.log("Enviando para API:", dadosParaEnviar); // Log para conferência
      await usuariosService.cadastrar(dadosParaEnviar);
      
      mostrarFeedback('Sucesso', 'Usuário cadastrado com sucesso!');
      await buscarUsuarios(); 

      // Reseta o formulário
      setUsuarioForm({
        usu_nome: '', usu_email: '', usu_cpf: '', usu_senha: '',
        usu_telefone: '', usu_status: 1, usu_alterar_senha: 0,
        tipo_acesso: '', empresa_vinculada: ''
      });
    } catch (err) {
      // CAPTURA DO ERRO REAL DO BACKEND
      const mensagemErro = err.response?.data?.mensagem || "Erro desconhecido";
      console.error("Erro do Backend:", mensagemErro);
      mostrarFeedback('Erro', mensagemErro); 
    }
  };

  const lancarNota = (e) => {
    e.preventDefault();

    if (!notaForm.empresa || !notaForm.data || !notaForm.valor || !notaForm.descricao.trim()) {
      mostrarFeedback(
        'Campos obrigatórios',
        'Preencha todos os campos antes de lançar a nota fiscal.'
      );
      return;
    }

    const empresaSelecionada = empresas.find(
      (empresa) => String(empresa.emp_id) === notaForm.empresa
    );

    const novaNota = {
      id: Date.now(),
      doc_id: Date.now(),
      doc_nome_original: 'Nota Fiscal',
      empresa_nome: empresaSelecionada?.emp_nome_fantasia || '',
      emp_cnpj: empresaSelecionada?.emp_cnpj || '',
      descricao: notaForm.descricao.trim(),
      valor: Number(notaForm.valor),
    };

    setNotas((prev) => [novaNota, ...prev]);

    setNotaForm({
      empresa: '',
      data: '',
      valor: '',
      descricao: '',
    });
  };

  const excluirNota = (id) => {
    setNotas((prev) => prev.filter((nota) => nota.id !== id));
  };

  const excluirEmpresa = (id) => {
    const empresaRemovida = empresas.find((item) => item.emp_id === id);

    setEmpresas((prev) => prev.filter((empresa) => empresa.emp_id !== id));

    if (empresaRemovida) {
      setNotas((prev) => prev.filter((nota) => nota.empresa_id !== empresaRemovida.emp_id));
    }
  };

  const excluirUsuario = (id) => {
    setUsuarios((prev) => prev.filter((usuario) => usuario.usu_id !== id));
  };

  const totalUsuarios = adminResumo?.totalUsuarios ?? 0;
  const totalEmpresas = adminResumo?.totalEmpresas ?? 0;
  const totalDocumentos = adminResumo?.totalDocumentos ?? 0;

  const faturamentoMensal = financeiroMensal?.faturamento ?? 0;
  const impostosMensais = financeiroMensal?.impostos ?? 0;
  const despesasMensais = financeiroMensal?.despesas ?? 0;
  const saldoMensal = financeiroMensal?.saldo ?? 0;

  if (loading && empresas.length === 0) {
    return <p>Carregando empresas...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className={styles.page}>
      {feedback.ativo && (
        <div className={styles.feedbackOverlay}>
          <div className={styles.feedbackModal}>
            <h3>{feedback.titulo}</h3>

            <p>{feedback.mensagem}</p>

            <button
              type="button"
              className={styles.feedbackButton}
              onClick={() =>
                setFeedback({
                  ativo: false,
                  titulo: '',
                  mensagem: '',
                })
              }
            >
              Entendi
            </button>
          </div>
        </div>
      )}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          {/* LOGO */}
          <div className={styles.logoArea}>
            <img src={logo} alt="Contax" className={styles.logoImg} />

            <div className={styles.logoText}>
              <h1 className={styles.brand}>CONTAX</h1>
              <span className={styles.brandSubtitle}>ME & MEI - Dashboard</span>
            </div>
          </div>

          {/* NAV */}
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
                activeTab === 'empresas' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('empresas')}
            >
              Empresas
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === 'usuarios' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('usuarios')}
            >
              Usuários
            </button>

            <button
              className={`${styles.navButton} ${
                activeTab === 'notas' ? styles.navButtonActive : ''
              }`}
              onClick={() => setActiveTab('notas')}
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
        {activeTab === 'dashboard' && (
          <>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statCardUsuarios}`}>
                <Users className={styles.statIcon} />

                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Usuários</span>
                  <div className={styles.statValue}>{totalUsuarios}</div>
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.statCardEmpresas}`}>
                <Building2 className={styles.statIcon} />

                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Empresas</span>
                  <div className={styles.statValue}>{totalEmpresas}</div>
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.statCardDocumentos}`}>
                <FileText className={styles.statIcon} />

                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Documentos</span>
                  <div className={styles.statValue}>{totalDocumentos}</div>
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.statCardFaturamento}`}>
                <DollarSign className={styles.statIcon} />

                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Faturamento Geral Mensal</span>
                  <div className={styles.statValue}>{formatCurrency(faturamentoMensal)}</div>
                </div>
              </div>
            </div>
            <div className={styles.dashboardLayout}>
              {/* ESQUERDA */}
              <section className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>
                    Visão Geral —{' '}
                    {new Date().toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h2>
                </div>

                {empresas.length === 0 ? (
                  <div className={styles.emptyBox}>Nenhuma empresa cadastrada.</div>
                ) : (
                  <div className={styles.dashboardCompanies}>
                    {empresas.map((empresa) => {
                      const notasEmpresa = notas.filter((n) => n.emp_id === empresa.emp_id);

                      const total = notasEmpresa.reduce(
                        (acc, n) => acc + Number(n.fin_valor_total || 0),
                        0
                      );

                      const limite = 2000;
                      const percentual = Math.min((total / limite) * 100, 100);

                      const status =
                        percentual < 50 ? 'Saudável' : percentual < 80 ? 'Atenção' : 'Risco';

                      return (
                        <div key={empresa.emp_id} className={styles.companyCard}>
                          <div className={styles.companyTop}>
                            
                          </div>

                          <div className={styles.companyContent}>
                            <div>
                              <div className={styles.companyName}>
                                <span
                                  className={`${styles.typeBadge} ${
                                  Number(empresa.emp_tipo) === 0 ? styles.badgeME : styles.badgeMEI
                                }`}
                                >
                                  {Number(empresa.emp_tipo) === 0 ? 'ME' : 'MEI'}
                                </span>
                                <strong
                                  className={styles.companyNameClickable}
                                  onClick={() => setEmpresaModal(empresa)}
                                >
                                  {empresa.emp_nome_fantasia}
                                </strong>
                              </div>
                              <div className={styles.companyInfoRow}>
                                <p className={styles.limitText}>
                                Limite: <strong>{formatCurrency(limite)}</strong> • 
                                Utilizado:{' '} <strong>{formatCurrency(total)}</strong> • 
                                Restante:{' '} <strong>{formatCurrency(limite - total)}</strong>                    
                                </p>

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

                            <div className={styles.progressArea}>
                              <div className={styles.progressBar}>
                                <div
                                  className={styles.progressFill}
                                  style={{ width: `${percentual}%` }}
                                />
                              </div>

                              <div className={styles.progressInfo}>
                                <strong className={styles.percent}>{
                                  percentual.toFixed(1)}%
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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

                  <button className={styles.primaryButton}>Aplicar</button>
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
                      <th>DOCUMENTO</th>
                      <th>VALOR</th>
                    </tr>
                  </thead>

                  <tbody>
                    {notas.length === 0 ? (
                      <tr>
                        <td colSpan="4" className={styles.emptyTable}>
                          Nenhuma nota emitida recentemente.
                        </td>
                      </tr>
                    ) : (
                      notas.map((nota) => (
                        <tr key={nota.doc_id || nota.id}>
                          <td>{formatDateBRFromAPI(nota.fin_data_emissao)}</td>

                          <td>
                            <strong>{nota.emp_nome_fantasia}</strong>
                          </td>

                          <td>
                            <strong>{nota.doc_nome_original}</strong>
                            <span className={styles.subText}>
                              {nota.tpd_descricao || 'Documento fiscal'}
                            </span>
                          </td>

                          <td className={styles.valueCell}>{formatCurrency(nota.fin_valor_total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        {activeTab === 'empresas' && (
          <>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Cadastrar Empresa</h2>
              </div>

              <form className={styles.form} onSubmit={cadastrarEmpresa}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Nome da empresa</label>

                    <input
                      type="text"
                      name="emp_nome_fantasia"
                      value={empresaForm.emp_nome_fantasia}
                      onChange={handleEmpresaChange}
                      className={styles.input}
                      placeholder="Ex.: Acme LTDA"
                    />
                  </div>

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
                </div>

                <div className={styles.row}>
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

                  <div className={styles.field}>
                    <label>Limite mensal (R$)</label>

                    <input
                      type="number"
                      name="emp_limite"
                      value={empresaForm.emp_limite || ''}
                      onChange={handleEmpresaChange}
                      className={styles.input}
                      placeholder="Ex.: 20000"
                    />
                  </div>
                </div>

                <button type="submit" className={styles.primaryButton}>
                  Salvar Empresa
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
                      <th>NOME</th>
                      <th>TIPO</th>
                      <th>LIMITE MENSAL</th>
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
                        <tr key={empresa.emp_id} className={styles.companyRow}>
                          <td>
                            <div className={styles.companyInfo}>
                              <strong>{empresa.emp_nome_fantasia}</strong>
                              <span>{empresa.emp_cnpj || '00.000.000/0000-00'}</span>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`${styles.companyBadge} ${
                                Number(empresa.emp_tipo) === 0 ? styles.badgeME : styles.badgeMEI
                              }`}
                            >
                              {Number(empresa.emp_tipo) === 0 ? 'ME' : 'MEI'}
                            </span>
                          </td>

                          <td className={styles.limitCell}>
                            {formatCurrency(empresa.emp_limite || 20000)}
                          </td>

                          <td className={styles.actionsCell}>
                            <button className={styles.editButton}>Editar</button>

                            <button
                              className={styles.deleteButton}
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

        {activeTab === 'usuarios' && (
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

        <div className={styles.rowThree}>
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

        <div className={styles.rowThree}>
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
            <label>Tipo de acesso</label>
            <select
              name="tipo_acesso"
              value={usuarioForm.tipo_acesso || ''}
              onChange={handleUsuarioChange}
              className={styles.input}
            >
              <option value="">Selecione</option>
              <option value="0">Visualizador</option>
              <option value="1">Gerente</option>
              <option value="2">Administrador</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Empresa vinculada</label>
            <select
              name="empresa_vinculada"
              value={usuarioForm.empresa_vinculada || ''}
              onChange={handleUsuarioChange}
              className={styles.input}
            >
              <option value="">Selecione uma empresa</option>

              {empresas.map((empresa) => (
                <option key={empresa.emp_id} value={empresa.emp_id}>
                  {empresa.emp_nome_fantasia}
                </option>
              ))}
            </select>
          </div>
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
              <th>NOME</th>
              <th>EMPRESA VINCULADA</th>
              <th>TIPO DE ACESSO</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(usuarios) && usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.usu_id} className={styles.userRow}>
                  <td>
                    <div className={styles.userInfo}>
                      <strong>{usuario.usu_nome}</strong>
                      <span>{usuario.usu_cpf || '000.000.000-00'}</span>
                    </div>
                  </td>

                  <td className={styles.companyLinkedCell}>
                    {usuario.empresa_nome || 'Nenhuma empresa vinculada'}
                  </td>

                  <td>
                    <span className={`${styles.accessBadge} ${styles.badgeViewer}`}>
                      {Number(usuario.tipo_acesso) === 2
                        ? 'Administrador'
                        : Number(usuario.tipo_acesso) === 1
                        ? 'Gerente'
                        : 'Visualizador'}
                    </span>
                  </td>

                  <td className={styles.statusCell}>
                    {Number(usuario.usu_status) === 1 ? 'Ativo' : 'Inativo'}
                  </td>

                  <td className={styles.actionsCell}>
                    <button className={styles.editButton}>Editar</button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => excluirUsuario(usuario.usu_id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.emptyTable}>
                  {loading ? 'Carregando usuários...' : 'Nenhum usuário cadastrado.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  </>
)}

        {activeTab === 'notas' && (
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
                      <th>EMPRESA</th>
                      <th>DOCUMENTO</th>
                      <th>DATA</th>
                      <th>VALOR</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {notas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={styles.emptyTable}>
                          Nenhuma nota fiscal lançada.
                        </td>
                      </tr>
                    ) : (
                      notas.map((nota) => (
                        <tr key={nota.doc_id} className={styles.noteRow}>
                          <td>
                            <div className={styles.noteCompanyInfo}>
                              <strong>
                                {nota.emp_nome_fantasia || nota.empresa || 'Empresa não informada'}
                              </strong>
                              <span>{nota.emp_cnpj || 'CNPJ não informado'}</span>
                            </div>
                          </td>

                          <td>
                            <div className={styles.noteDocumentInfo}>
                              <strong>{nota.doc_nome_original || 'Nota Fiscal'}</strong>
                              <span>{nota.tpd_descricao || 'Documento fiscal'}</span>
                            </div>
                          </td>

                          <td className={styles.noteDateCell}>
                            {formatDateBRFromAPI(nota.fin_data_emissao)}
                          </td>

                          <td className={styles.noteValueCell}>{formatCurrency(nota.fin_valor_total)}</td>

                          <td>
                            <span className={styles.noteStatusBadge}>Ativo</span>
                          </td>

                          <td className={styles.actionsCell}>
                            <button className={styles.editButton}>Editar</button>

                            <button
                              className={styles.deleteButton}
                              onClick={() => excluirNota(nota.doc_id)}
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

      {empresaModal && (
  <div className={styles.modalOverlay} onClick={() => setEmpresaModal(null)}>
    <div className={styles.companyModal} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={styles.modalClose}
        onClick={() => setEmpresaModal(null)}
      >
        ×
      </button>

      <h2>{empresaModal.emp_nome_fantasia}</h2>

      <div className={styles.modalInfoGrid}>
        <p><strong>Razão Social:</strong> {empresaModal.emp_razao_social || 'Não informado'}</p>
        <p><strong>CNPJ:</strong> {empresaModal.emp_cnpj || 'Não informado'}</p>
        <p><strong>E-mail:</strong> {empresaModal.emp_email || 'Não informado'}</p>
        <p><strong>Telefone:</strong> {empresaModal.emp_telefone || 'Não informado'}</p>
        <p><strong>Município:</strong> {empresaModal.emp_municipio || 'Não informado'}</p>
        <p>
          <strong>Tipo:</strong>{' '}
          {Number(empresaModal.emp_tipo) === 0 ? 'ME' : 'MEI'}
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function formatCurrency(value) {
  const numero = Number(value || 0);

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDateBR(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function formatDateBRFromAPI(dateString) {
  if (!dateString) return '-';

  const date = new Date(dateString);

  return date.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });
}
