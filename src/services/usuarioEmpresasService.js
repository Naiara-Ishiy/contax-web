import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

export const usuarioEmpresasService = {
  listar: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/usuario_empresas`, {
      params,
      ...getAuthHeaders(),
    });

    return response.data;
  },

  cadastrar: async (dados) => {
    const response = await axios.post(
      `${API_BASE_URL}/usuario_empresas`,
      dados,
      getAuthHeaders()
    );

    return response.data;
  },

  editar: async (id, dados) => {
    const response = await axios.patch(
      `${API_BASE_URL}/usuario_empresas/${id}`,
      dados,
      getAuthHeaders()
    );

    return response.data;
  },

  ocultar: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/usuario_empresas/del/${id}`,
      getAuthHeaders()
    );

    return response.data;
  },
};