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

export const createOrUpdatePetProfile = (data) => API.post('/pets/create-update', data);

export const getMarketingSegments = (petId) => API.get(`/pets/${petId}/segments`);

export const recalculateBiologicalAge = (data) => API.post('/pets/recalculate-age', data);

export const generateCreativeContent = (data) => API.post('/ai-creative/generate', data);

export const getPromptTemplate = () => API.get('/ai-creative/template');

export const mintPITToken = (data) => API.post('/pit-token/mint', data);

export const getPITToken = (petId) => API.get(`/pit-token/${petId}`);

export const applyForBNPLLoan = (data) => API.post('/fintech/apply-loan', data);

export const getUserLoans = () => API.get('/fintech/loans');

