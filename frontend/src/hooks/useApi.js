import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance.js";

export const useApi = (endpoint, requestOptions) => {
  const {
    force = true,
    method = 'GET',
    defaultValue = null,
    ...options
  } = requestOptions || {};

  const [data, setData] = useState(defaultValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(method === "GET" && force);

  const request = async (payload = null) => {
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance({
        url: endpoint,
        method,
        data: payload,
        ...options
      });
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (method === "GET" && force) {
      request();
    }
  }, []);

  return { request, data, error, loading };
};