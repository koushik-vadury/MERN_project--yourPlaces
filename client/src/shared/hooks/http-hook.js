import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);
      try {
        console.log("1");
        setIsLoading(true);
        console.log("2");
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();
        console.log("3");
        console.log(responseData);
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        console.log("4");

        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
