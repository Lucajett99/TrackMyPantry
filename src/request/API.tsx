import { setToken, getToken, setDate, getDate } from './utility'
const baseURL = 'https://cors-anywhere.herokuapp.com/https://lam21.modron.network';



//sign in
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
        if(response.ok) {
                const token = await response.clone().json();
                await setToken(token);
                await setDate();
        }
        return response;
}

//sign up
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
export async function getProducts(barcode: String) {
        const data = await getToken();
        const date = await getDate();
        if(!data)
                return null;
        console.log(date)
        const { accessToken } = await getToken();
        console.log(accessToken)
        const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
            };
        const response = await fetch(baseURL + '/products?barcode=' + barcode, requestOptions);
        console.log(response.status);
        return response;
}

//post products
export async function postProduct(token: any, name: any, description: any, barcode: any, test: boolean) {
        const productData = {
                username: barcode
        };
        const accessToken = await getToken() || '';
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
                body: JSON.stringify(productData)
            };
        const response = await fetch(baseURL + '/products', requestOptions);
        console.log(response.status);
        return response;
}


export async function usersMe() {
        const { accessToken } = await getToken();
        const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'accessToken': accessToken },
            };
        const response = await fetch(baseURL + '/users/me', requestOptions);
        console.log(response.status);
        return response;
}

