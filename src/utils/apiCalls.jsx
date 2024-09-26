import axiosInstance from "./axiosInstance";

export const PostRequest = async (url, data, token) => {
  try {
    const response = await axiosInstance.post(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response)
    console.log("url",url)
    console.log("data",data)
    return response;
  } catch (error) {
    return error;
  }
};

export const GetRequest = async (url, token) => {
  try {
    const response = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'An error occurred');
  }
};

export const PutRequest = async (url, data, token) => {
  try {
    const response = await axiosInstance.put(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'An error occurred');
  }
};
