import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333';

const getAuthHeaders = () => ({
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

export const empresasService = {
  // Listagem com suporte a paginação e parâmetros seguros
  listar: async (params = {}) => {
    // Definimos valores padrão para evitar erros caso o front não envie nada
    const limit = params.limit || 10; 
    const page = params.page || 1;
    
    const response = await axios.get(`${API_BASE_URL}/empresas`, {
      params: { limit, page }, // O axios monta a URL corretamente (?limit=10&page=1)
      ...getAuthHeaders()
    });
    return response.data;
  },

  // Cadastro de empresa
cadastrar: async (dados) => {
  const payload = {
    nome: dados.emp_nome_fantasia,
    razao_social: dados.emp_razao_social,
    cnpj: dados.emp_cnpj,
    endereco: dados.emp_endereco,
    municipio: dados.emp_municipio,
    telefone: dados.emp_telefone,
    email: dados.emp_email,
    tipo: Number(dados.emp_tipo),
    senha: dados.emp_senha,
  };

  const response = await axios.post(
    `${API_BASE_URL}/empresas`,
    payload,
    getAuthHeaders()
  );

  return response.data;
},

  // Edição
  editar: async (id, dados) => {
    const response = await axios.patch(`${API_BASE_URL}/empresas/${id}`, dados, getAuthHeaders());
    return response.data;
  },

  // Exclusão
  apagar: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/empresas/${id}`, getAuthHeaders());
    return response.data;
  },

  ocultar: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/empresas/del/${id}`, getAuthHeaders());
    return response.data;
  },
};