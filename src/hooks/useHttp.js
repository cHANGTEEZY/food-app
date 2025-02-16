import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);
  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Something went wrong");
  }

  return resData;
}

const useHttp = (url, config, initialData) => {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function clearData() {
    setData(null);
  }

  const sendRequest = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);

      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
      } catch (error) {
        setError(error.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    },
    [url, config]
  );

  useEffect(() => {
    if (config && (!config.method || config.method === "GET")) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return { data, error, isLoading, sendRequest, clearData };
};

export default useHttp;
