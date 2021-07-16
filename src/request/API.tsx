import axios from 'axios';
const baseURL = 'https://lam21.modron.network'

//login
export function login(email: any, password: any) {
        const loginData = {
                email: email,
                password: password
        };
        const api = axios.create({
                baseURL: baseURL,
                headers: {'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'}
        });
        api.post('/auth/login', loginData)
        .then((res) => {
                console.log(res.data);
        })
        .catch((error) => {
                console.log(error);
        });
}

//register
export function register(username: any, email: any, password: any) {
        const registerData = {
                username: username,
                email: email,
                password: password
        };
        const api = axios.create({
                baseURL: baseURL,
                headers: {'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'}
        });
        api.post('/users', registerData)
        .then((res) => {
                console.log(res.data);
        })
        .catch((error) => {
                console.log(error);
        });
}