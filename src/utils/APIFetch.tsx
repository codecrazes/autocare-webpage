const baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error: ${response.status} - ${errorMessage}`);
  }

  return response.json();
};

export default apiFetch;
