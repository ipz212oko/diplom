import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance.js";

export const useApi = (endpoint, requestOptions) => {
  const {
    force,
    method = 'GET',
    defaultValue = null,
    ...options
  } = requestOptions || {};

  const forceRequest = force ?? method === "GET";

  const [data, setData] = useState(defaultValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(forceRequest);

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

      if (!forceRequest) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (forceRequest) {
      request();
    }
  }, []);

  return { request, data, error, loading };
};