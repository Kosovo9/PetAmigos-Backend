import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });



API.interceptors.request.use((req) => {

    if (localStorage.getItem('profile')) {

        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;

    }

    return req;

});



export const signIn = (formData) => API.post('/auth/signin', formData);

export const signUp = (formData) => API.post('/auth/signup', formData);

export const createCheckoutSession = (data) => API.post('/pay/create-checkout-session', data);

export const chatWithPet = (data) => API.post('/ai/chat', data);

