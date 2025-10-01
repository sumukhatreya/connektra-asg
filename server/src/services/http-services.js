import axios from 'axios';

export const makeRequest = async (url, method, headers, body) => {
  const response = await axios({
    url,
    method,
    headers,
    data: body
  });
  
  return response.data;
}