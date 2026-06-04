import axios from "axios";

const API = "http://localhost:5000/api/crops";

export const addCrop = (cropData) => {
  return axios.post(`${API}/add`, cropData);
};

export const getFarmerCrops = (farmer_id) => {
  return axios.get(`${API}/farmer/${farmer_id}`);
};

export const deleteCrop = (crop_id) => {
  return axios.delete(`${API}/delete/${crop_id}`);
};
