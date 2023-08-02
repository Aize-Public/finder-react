export const fetchMetaData = async () => {
  const response = await fetch("/api/meta", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
