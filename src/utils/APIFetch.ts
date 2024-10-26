const baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const handleTokenExpiration = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/login';
};

const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorDetail: string;

    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || 'Erro desconhecido'; 
    } catch {
      errorDetail = await response.text() || 'Erro desconhecido';
    }

    if (response.status === 401) {
      handleTokenExpiration();
    }

    throw {
      response: {
        status: response.status,
        statusText: response.statusText,
        data: { detail: errorDetail },
      },
    };
  }

  return response.json();
};

export default apiFetch;
