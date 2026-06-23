import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333'; // Ajuste se necessário

const getAuthHeaders = () => ({
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

export const usuariosService = {
  listar: async (params = {}) => {
    const limit = params.limit || 10; 
    const page = params.page || 1;
    
    // CORREÇÃO: Usar a variável 'params' ou remover a menção a 'filtros'
    const response = await axios.get(`${API_BASE_URL}/usuarios`, {
      params: { limit, page }, // Enviando os parâmetros corretamente para o axios
      ...getAuthHeaders()
    });
    return response.data;
  },

  // POST /usuarios
  cadastrar: async (dados) => {
    console.log("Serviço está enviando estes dados:", dados); // ADICIONE ISSO
    const response = await axios.post(`${API_BASE_URL}/usuarios`, dados, getAuthHeaders());
    return response.data;
  },

  // PATCH /usuarios/:id
  editar: async (id, dados) => {
    const response = await axios.patch(`${API_BASE_URL}/usuarios/${id}`, dados, getAuthHeaders());
    return response.data;
  },

  // DELETE /usuarios/:id (Exclusão física)
  apagar: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/usuarios/${id}`, getAuthHeaders());
    return response.data;
  },

  // DELETE /usuarios/del/:id (Exclusão lógica/ocultar)
  ocultar: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/usuarios/del/${id}`, getAuthHeaders());
    return response.data;
  },

  // GET /usuarios/:id (Listar empresas vinculadas)
  listarEmpresasDoUsuario: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/usuarios/${id}`, getAuthHeaders());
    return response.data;
  }
};