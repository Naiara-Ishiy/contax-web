import React, { useMemo, useState, useEffect } from 'react';
import { Users, Building2, FileText, DollarSign, User } from 'lucide-react';
import styles from './index.module.css';
import api from '../../../services/apis';

import logo from '../../../assets/logoContaxCor.png';

import { usuariosService } from '../../../services/usuariosService';
import { empresasService } from '../../../services/empresasService';
import { usuarioEmpresasService } from '../../../services/usuarioEmpresasService';

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
  const [usuarioSendoEditado, setUsuarioSendoEditado] = useState(null);
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
    const response = await empresasService.listar();
    setEmpresas(response.dados || response.data?.dados || []);
  } catch (err) {
    console.log(err);
    setEmpresas([]);
    mostrarFeedback('Erro', 'Erro ao carregar empresas.');
  }
};

const buscarUsuarios = async () => {
  try {
    const response = await usuariosService.listar({ limit: 25 });
    setUsuarios(response.dados || response.data?.dados || []);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    setUsuarios([]);
    mostrarFeedback('Erro', 'Erro ao carregar usuários.');
  }
};

  const prepararEdicaoUsuario = (usuario) => {
    setUsuarioSendoEditado(usuario.usu_id || usuario.id); 
  
    setUsuarioForm({
      usu_nome: usuario.usu_nome || usuario.nome || '',
      usu_email: usuario.usu_email || usuario.email || '',
      usu_cpf: usuario.usu_cpf || usuario.cpf || '',
      usu_senha: '', 
      usu_telefone: usuario.usu_telefone || usuario.telefone || '',
      usu_status: usuario.usu_status ?? 1,
      usu_alterar_senha: usuario.usu_alterar_senha ?? 0,
      tipo_acesso: usuario.nivel_acesso || usuario.tipo_acesso || '',
      empresa_vinculada: usuario.emp_id || usuario.empresa_vinculada || '',
      usu_emp_id: usuario.usu_emp_id || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

const buscarNotas = async () => {
  try {
    const response = await api.get('/documentos');
    setNotas(response.data.dados || []);
  } catch (err) {
    console.log(err);
    setNotas([]);
    mostrarFeedback('Erro', 'Erro ao carregar notas fiscais.');
  }
};

  useEffect(() => {
  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);

      await Promise.all([
        buscarEmpresas(),
        buscarUsuarios(),
        buscarNotas(),
        buscarDashboardAdmin(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  carregarDadosIniciais();
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
    emp_limite: '',
  });

  const [notaForm, setNotaForm] = useState({
    empresa: '',           // Será o emp_id
    tpd_id: '1',           // Padrão 1 para 'Nota Fiscal' (ou dinâmico se tiver select)
    data: '',              // doc_data_vencimento
    valor: '',             // fin_valor
    descricao: '',         // doc_observacao
    arquivo: null,         // <--- ADICIONADO: Guardará o arquivo PDF físico
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
    usu_emp_id: '',
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

  const handleArquivoChange = (e) => {
    setNotaForm((prev) => ({
      ...prev,
      arquivo: e.target.files[0], // Pega o primeiro arquivo selecionado
    }));
  };

  const cadastrarEmpresa = async (e) => {
  e.preventDefault();

  if (
    !empresaForm.emp_nome_fantasia.trim() ||
    !empresaForm.emp_razao_social.trim() ||
    !empresaForm.emp_cnpj.trim()
  ) {
    mostrarFeedback(
      'Campos obrigatórios',
      'Preencha nome fantasia, razão social e CNPJ.'
    );
    return;
  }

  if (Number(empresaForm.emp_tipo) === 1) {
  const razaoSocial = empresaForm.emp_razao_social.trim().toUpperCase();

  if (razaoSocial.includes('LTDA')) {
    mostrarFeedback('Regra para MEI', 'MEI não pode ter razão social LTDA.');
    return;
  }

  if (!/\d{11}$/.test(razaoSocial)) {
    mostrarFeedback(
      'Regra para MEI',
      'A razão social do MEI deve terminar com o CPF do titular, contendo 11 números.'
    );
    return;
  }
}

  try {
    setLoading(true);

    await empresasService.cadastrar({
      emp_nome_fantasia: empresaForm.emp_nome_fantasia.trim(),
      emp_razao_social: empresaForm.emp_razao_social.trim(),
      emp_cnpj: empresaForm.emp_cnpj.trim(),
      emp_endereco: empresaForm.emp_endereco.trim(),
      emp_municipio: empresaForm.emp_municipio.trim(),
      emp_telefone: empresaForm.emp_telefone.trim(),
      emp_email: empresaForm.emp_email.trim(),
      emp_senha: empresaForm.emp_senha.trim(),
      emp_tipo: Number(empresaForm.emp_tipo),
      emp_limite: Number(empresaForm.emp_limite || 20000),
    });

    mostrarFeedback('Sucesso', 'Empresa cadastrada com sucesso!');

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
      emp_limite: '',
    });

    await buscarEmpresas();
    await buscarDashboardAdmin();
  } catch (err) {
    const mensagem =
      err.response?.data?.mensagem || 'Erro ao cadastrar empresa.';
    mostrarFeedback('Erro', mensagem);
  } finally {
    setLoading(false);
  }
};

const salvarUsuario = async (e) => {
  e.preventDefault();

const hoje = new Date().toISOString().split('T')[0];

const dadosParaEnviar = {
  nome: usuarioForm.usu_nome,
  email: usuarioForm.usu_email,
  cpf: usuarioForm.usu_cpf,
  senha: usuarioForm.usu_senha.trim() || 'MANTIDA_SEM_ALTERACAO',
  telefone: usuarioForm.usu_telefone,
  alterar_senha: Number(usuarioForm.usu_alterar_senha) || 0,

  emp_id: Number(usuarioForm.empresa_vinculada),
  nivel_acesso: Number(usuarioForm.tipo_acesso),
  data_vinculo: hoje,
  observacoes: null,
};

  if (!usuarioForm.empresa_vinculada || usuarioForm.tipo_acesso === '') {
    mostrarFeedback('Campos obrigatórios', 'Selecione a empresa vinculada e o tipo de acesso.');
    return;
  }

try {
  setLoading(true);

if (usuarioSendoEditado) {
  await usuariosService.editar(usuarioSendoEditado, {
    nome: usuarioForm.usu_nome,
    email: usuarioForm.usu_email,
    cpf: usuarioForm.usu_cpf,
    senha: usuarioForm.usu_senha.trim() || 'MANTIDA_SEM_ALTERACAO',
    telefone: usuarioForm.usu_telefone,
    status: Number(usuarioForm.usu_status),
    alterar_senha: Number(usuarioForm.usu_alterar_senha) || 0,
  });

  if (usuarioForm.usu_emp_id) {
    await usuarioEmpresasService.editar(usuarioForm.usu_emp_id, {
      emp_id: Number(usuarioForm.empresa_vinculada),
      usu_id: Number(usuarioSendoEditado),
      nivel_acesso: Number(usuarioForm.tipo_acesso),
      data_vinculo: hoje,
      status: Number(usuarioForm.usu_status),
      observacoes: null,
    });
  }

  mostrarFeedback('Sucesso', 'Usuário atualizado com sucesso!');
} else {
    // Lógica de cadastro...
    if (!usuarioForm.usu_senha.trim()) {
      mostrarFeedback('Aviso', 'A senha é obrigatória para um novo cadastro.');
      setLoading(false);
      return;
    }
    await usuariosService.cadastrar(dadosParaEnviar);
    mostrarFeedback('Sucesso', 'Usuário cadastrado com sucesso!');
  }

  // Limpeza do formulário...
  setUsuarioSendoEditado(null);
  setUsuarioForm({
    usu_nome: '',
    usu_email: '',
    usu_cpf: '',
    usu_senha: '',
    usu_telefone: '',
    usu_status: 1,
    usu_alterar_senha: 0,
    tipo_acesso: '',
    empresa_vinculada: '',
    usu_emp_id: '',
  });

  await buscarUsuarios(); 
} catch (err) {
  const mensagemErro = err.response?.data?.mensagem || "Erro ao salvar alterações do usuário.";
  console.error("Erro na operação de usuário:", mensagemErro);
  mostrarFeedback('Erro', mensagemErro); 
} finally {
  setLoading(false);
}
};

  const lancarNota = async (e) => {
    e.preventDefault();

    // 1. Validações estritas dos campos no Front-end antes de disparar a API
    if (!notaForm.empresa || !notaForm.valor || !notaForm.arquivo) {
      mostrarFeedback(
        'Campos obrigatórios',
        'Por favor, selecione a Empresa Cliente, o Valor e o Arquivo PDF da nota.'
      );
      return;
    }

    try {
      setLoading(true);

      // 2. Cria o objeto FormData necessário para transporte de arquivos binários
      const formData = new FormData();
      formData.append('img', notaForm.arquivo); // 'img' deve bater com o upload.single('img') das suas rotas
      formData.append('emp_id', notaForm.empresa);
      formData.append('tpd_id', notaForm.tpd_id);
      formData.append('fin_valor', notaForm.valor);
      formData.append('fin_categoria', 'Nota Fiscal Lançada'); // Categoria padrão ou adicione campo no form
      formData.append('doc_observacao', notaForm.descricao.trim());
      formData.append('doc_data_vencimento', notaForm.data);

      // 3. Dispara a requisição para a rota que aponta para o notas.js
      const response = await api.post('/documentos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
          // O Token real (localStorage) será injetado automaticamente aqui pelo interceptor da sua instância 'api'
        }
      });

      if (response.data.sucesso) {
        mostrarFeedback('Sucesso', 'Nota fiscal armazenada e financeiro gerado com sucesso!');
        
        // 4. Limpa o formulário na tela após o sucesso
        setNotaForm({
          empresa: '',
          tpd_id: '1',
          data: '',
          valor: '',
          descricao: '',
          arquivo: null,
        });

        // Limpa visualmente o input de arquivo caso use uma referência ou id
        const fileInput = document.getElementById('input-arquivo-id'); // Ajuste se houver ID
        if (fileInput) fileInput.value = '';

        // 5. Atualiza a listagem de notas do painel administrativo imediatamente
        await buscarNotas();
        await buscarDashboardAdmin();
      }

    } catch (err) {
      const mensagemErro = err.response?.data?.mensagem || "Erro ao efetuar o lançamento da nota no servidor.";
      console.error("Erro no upload combinado:", err);
      mostrarFeedback('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const excluirNota = async (id) => {
  if (!window.confirm('Tem certeza que deseja excluir/desativar esta nota?')) {
    return;
  }

  try {
    setLoading(true);

    await api.delete(`/documentos/del/${id}`);

    mostrarFeedback('Sucesso', 'Nota fiscal removida com sucesso!');

    await buscarNotas();
    await buscarDashboardAdmin();
  } catch (err) {
    const mensagem =
      err.response?.data?.mensagem || 'Erro ao excluir nota fiscal.';
    mostrarFeedback('Erro', mensagem);
  } finally {
    setLoading(false);
  }
};

  const excluirEmpresa = async (id) => {
  if (!window.confirm('Tem certeza que deseja excluir/desativar esta empresa?')) {
    return;
  }

  try {
    setLoading(true);

    await empresasService.ocultar(id);

    mostrarFeedback('Sucesso', 'Empresa removida com sucesso!');

    await buscarEmpresas();
    await buscarNotas();
    await buscarDashboardAdmin();
  } catch (err) {
    const mensagem =
      err.response?.data?.mensagem || 'Erro ao excluir empresa.';
    mostrarFeedback('Erro', mensagem);
  } finally {
    setLoading(false);
  }
};

const excluirUsuario = async (id) => {
  if (window.confirm("Tem certeza que deseja desativar este usuário?")) {
    try {
      setLoading(true);

      const usuarioAtual = usuarios.find(u => u.usu_id === id);

      const dadosDesativar = {
        nome: usuarioAtual?.usu_nome,
        email: usuarioAtual?.usu_email,
        cpf: usuarioAtual?.usu_cpf,
        senha: "MANTIDA_SEM_ALTERACAO", // Passa o padrão exigido pelo seu back-end
        telefone: usuarioAtual?.usu_telefone,
        status: 0, // <--- Aqui desativamos o usuário
        alterar_senha: Number(usuarioAtual?.usu_alterar_senha) || 0
      };

      await usuariosService.editar(id, dadosDesativar);

      mostrarFeedback('Sucesso', 'Usuário desativado com sucesso!');
      await buscarUsuarios(); 
    } catch (err) {
      const mensagemErro = err.response?.data?.mensagem || "Erro ao desativar usuário no servidor.";
      console.error("Erro ao deletar:", mensagemErro);
      mostrarFeedback('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  }
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

                      const limite = Number(empresa.emp_tipo) === 1 ? 6750 : 20000;
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
      placeholder="Ex.: Acme Comércio"
    />
  </div>

  <div className={styles.field}>
    <label>Razão Social</label>

    <input
      type="text"
      name="emp_razao_social"
      value={empresaForm.emp_razao_social}
      onChange={handleEmpresaChange}
      className={styles.input}
      placeholder="Ex.: Nome do Titular 12345678900"
    />
  </div>
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

<div className={styles.row}>
  <div className={styles.field}>
    <label>Município</label>

    <input
      type="text"
      name="emp_municipio"
      value={empresaForm.emp_municipio}
      onChange={handleEmpresaChange}
      className={styles.input}
      placeholder="Ex.: Quintana"
    />
  </div>

  <div className={styles.field}>
    <label>Telefone</label>

    <input
      type="text"
      name="emp_telefone"
      value={empresaForm.emp_telefone}
      onChange={handleEmpresaChange}
      className={styles.input}
      placeholder="(00) 00000-0000"
    />
  </div>
</div>

<div className={styles.row}>
  <div className={styles.field}>
    <label>E-mail</label>

    <input
      type="email"
      name="emp_email"
      value={empresaForm.emp_email}
      onChange={handleEmpresaChange}
      className={styles.input}
      placeholder="empresa@email.com"
    />
  </div>

  <div className={styles.field}>
    <label>Senha</label>

    <input
      type="password"
      name="emp_senha"
      value={empresaForm.emp_senha}
      onChange={handleEmpresaChange}
      className={styles.input}
      placeholder="Senha de acesso"
    />
  </div>
</div>

<div className={styles.field}>
  <label>Endereço</label>

  <input
    type="text"
    name="emp_endereco"
    value={empresaForm.emp_endereco}
    onChange={handleEmpresaChange}
    className={styles.input}
    placeholder="Rua, número, bairro"
  />
</div>

<div className={styles.field}>
  <label>Limite mensal</label>

  <input
    type="number"
    name="emp_limite"
    value={empresaForm.emp_limite || ''}
    onChange={handleEmpresaChange}
    className={styles.input}
    placeholder="MEI: 6750 / ME: 20000"
  />
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
                            {formatCurrency(Number(empresa.emp_tipo) === 1 ? 6750 : empresa.emp_limite || 20000)}
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
        <h2>Cadastrar Usuário</h2>
      </div>

      <form className={styles.form} onSubmit={salvarUsuario}>
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
          {usuarioSendoEditado ? 'Salvar Alterações' : 'Cadastrar Usuário'}
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
                      {Number(usuario.nivel_acesso) === 2
                        ? 'Administrador'
                        : Number(usuario.nivel_acesso) === 1
                        ? 'Gerente'
                        : 'Visualizador'}
                    </span>
                  </td>

                  <td className={styles.statusCell}>
                    {Number(usuario.usu_status) === 1 ? 'Ativo' : 'Inativo'}
                  </td>

                  <td className={styles.actionsCell}>
                    <button 
                      className={styles.editButton}
                      onClick={() => prepararEdicaoUsuario(usuario)}
                    >
                      Editar
                    </button>
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

                <div className={styles.field}>
  <label>Arquivo PDF</label>

  <input
    id="input-arquivo-id"
    type="file"
    accept="application/pdf"
    onChange={handleArquivoChange}
    className={styles.input}
    disabled={!isAdmin}
  />
</div>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={!isAdmin || empresas.length === 0 || loading}
                >
                  {loading ? 'Salvando...' : 'Lançar Nota'}
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
