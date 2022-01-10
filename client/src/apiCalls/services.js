import axios from 'axios';

const PATH = axios.create({ baseURL: "http://localhost:7000" });
//Add Api Calls
export const addUser = (data) => PATH.post('/add/addUser', data);
export const addUserSocial = (data) => PATH.post('/add/addUserSocial', data);
export const addAddress = (email, data) => PATH.post(`/add/addAddress/${email}`, data, {
    headers: {
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token'))
    }
});
export const addCart = (email, cart) => PATH.post(`/add/addCart/${email}`, cart);

//Get Details Api Calls
export const getUser = (email, password) => PATH.get(`/get/getUser/${email}/${password}`);
export const getSocialUser = (email) => PATH.get(`/get/getSocialUser/${email}`);
export const getAddress = (email) => PATH.get(`/get/getAddress/${email}`, {
    headers: {
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token'))
    }
});
export const getAllProducts = () => PATH.get(`/get/getAllProducts`);
export const getCategoriesAndColors = () => PATH.get(`/get/getCategoriesAndColors`);
export const getFilteredProducts = (filter) => PATH.post(`get/getFilteredProducts`, filter);
export const getSpecificProducts = (id) => PATH.get(`/get/getSpecificProducts/${id}`);
export const getCart = (email) => PATH.get(`/get/getCart/${email}`);


//Edit Profile Links
export const updateUserDetails = (email, data) => PATH.post(`/update/updateUserDetails/${email}`, data, {
    headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token'))
    }
});
export const updatePassword = (email, data) => PATH.put(`/update/changePassword/${email}`, data, {
    headers: {
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token'))
    }
});


// forget Password Api Calls
export const forgotPasswordOtp = (email) => PATH.put(`/update/forgotPasswordOtp/${email}`);
export const verifyOtp = (email, data) => PATH.put(`/update/verifyOtp/${email}`, data);
export const setUserPassword = (email, data) => PATH.put(`/update/setUserPassword/${email}`, data, {
    headers: {
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('forgotPasswordToken'))
    }
});


//delete
export const deleteUserAddress = (email, data) => PATH.delete(`/delete/deleteUserAddress/${email}/${data}`)


