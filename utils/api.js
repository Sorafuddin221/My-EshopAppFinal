const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const api = {
  get: async (path, token = null) => {
    const headers = token ? { 'x-auth-token': token } : {};
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Something went wrong');
    }
    return response.json();
  },

  post: async (path, data, token = null, isFormData = false) => {
    const headers = {
      ...(token && { 'x-auth-token': token }),
    };

    let body;
    if (isFormData) {
      body = data; // data is already FormData
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: body,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Something went wrong');
    }
    return response.json();
  },

  put: async (path, data, token = null, isFormData = false) => {
    const headers = {
      ...(token && { 'x-auth-token': token }),
    };

    let body;
    if (isFormData) {
      body = data; // data is already FormData
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers,
      body: body,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Something went wrong');
    }
    return response.json();
  },

  delete: async (path, token = null) => {
    const headers = token ? { 'x-auth-token': token } : {};
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Something went wrong');
    }
    return response.json();
  },
};

export default api;
