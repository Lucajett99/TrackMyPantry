import axios from 'axios';
const baseURL = 'https://cors-anywhere.herokuapp.com/https://lam21.modron.network';
let accessToken : any;

//login
export async function login(email: String, password: String) {
        const loginData = {
                email: email,
                password: password
        };
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            };
        const response = await fetch(baseURL + '/auth/login', requestOptions);
        return response;
}

//register
export async function register(username: String, email: String, password: String) {
        const registerData = {
                username: username,
                email: email,
                password: password
        };
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            };
        const response = await fetch(baseURL + '/users', requestOptions);
        console.log(response.status);
        return response;
}

//get products
export function getProducts(barcode: any) {
        const product = {
                barcode: barcode
        };
        const api = axios.create({
                baseURL: baseURL,
                headers: {'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS', 'accessToken' : accessToken} //need access token
        });
        api.post('/users', product)
        .then((res) => {
                console.log(res.data);
        })
        .catch((error) => {
                console.log(error);
        });
}

//post products
export function postProduct(token: any, name: any, description: any, barcode: any, test: boolean) {
        const product = {
                token: token,
                name: name,
                description: description,
                barcode: barcode,
                test: test 
        };
        const api = axios.create({
                baseURL: baseURL,
                headers: {'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS', 'accessToken' : accessToken} //need access token
        });
        api.post('/users', product)
        .then((res) => {
                console.log(res.data);
        })
        .catch((error) => {
                console.log(error);
        });
}