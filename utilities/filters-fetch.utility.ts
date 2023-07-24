export const fetchMetaData = async () => {
  const response = await fetch("http://localhost:3000/api/meta", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
