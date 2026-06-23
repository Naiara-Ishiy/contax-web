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
    console.log("Enviando dados da empresa para API:", dados);
    const response = await axios.post(`${API_BASE_URL}/empresas`, dados, getAuthHeaders());
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
  }
};