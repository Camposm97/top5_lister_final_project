import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const createTop5List = (payload) => api.post(`/top5list/`, payload)
export const getAllTop5Lists = () => api.get(`/top5lists/`)
export const getTop5ListPairs = (payload) => api.post(`/top5listpairs/`, payload)
export const updateTop5ListById = (id, payload) => api.put(`/top5list/${id}`, payload)
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload);
export const loginUser = (payload) => api.post(`/login/`, payload);
export const logoutUser = () => api.get(`/logout/`);

const apis = {
    createTop5List,
    getAllTop5Lists,
    getTop5ListPairs,
    updateTop5ListById,
    deleteTop5ListById,
    getTop5ListById,
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
