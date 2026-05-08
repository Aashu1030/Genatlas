import axios from "axios";

const BASE_URL = "https://rest.ensembl.org";

const headers = {
  "Content-Type": "application/json"
};

export const getGeneBySymbol = async (symbol) => {
  const response = await axios.get(
    `${BASE_URL}/lookup/symbol/homo_sapiens/${symbol}`,
    { headers }
  );

  return response.data;
};