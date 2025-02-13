import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorStatus = error.response.status;
    const errorMessage = error.response?.data?.message || error.response?.data?.details?.[0];

    if (errorStatus === 401) {
      localStorage.removeItem('token');
      window.location.reload();
    }

    return Promise.reject({
      statusCode: errorStatus,
      message: errorMessage || "Упс, щось пішло не так",
    });
  }
);