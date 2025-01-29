import axios from "axios";

// default
const apiClient = axios.create({
  baseURL: "https://app-interview.easyglue.in/", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Common request handler
const apiRequest = async (method, url, data = null, params = null) => {
    
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
    });

    return response.data; 
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};


export const getApi = (url, params = null) => apiRequest("GET", url, null, params);
export const postApi = (url, data) => apiRequest("POST", url, data);
export const putApi = (url, data) => apiRequest("PUT", url, data);
export const deleteApi = (url) => apiRequest("DELETE", url);
