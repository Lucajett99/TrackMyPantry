import { setValue, getValue } from './utility';
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
                await setValue("accessToken", token);
                await setValue("date", new Date());
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
        if(response.ok) {
                await setValue("email", email);
                await setValue("username", username);
        }
        console.log(response.status);
        return response;
}

//get products
export async function getProducts(barcode: String) {
        const data = await getValue("accessToken");
        if(!data)
                return null;
        const { accessToken } = data;
        const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
            };
        const response = await fetch(baseURL + '/products?barcode=' + barcode, requestOptions);
        console.log(response.status);
        return response;
}

//post products
export async function postProduct(token: any, name: any, description: any, barcode: any, test: boolean, image?: any) {
        const productData = {
                token: token,
                barcode: barcode,
                name: name,
                img: image,
                description: description,
                test: test
        };
        const data = await getValue("accessToken");
        if(!data)
                return null;
        const { accessToken } = data;
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
                body: JSON.stringify(productData)
        };
        const response = await fetch(baseURL + '/products', requestOptions);
        console.log(response.status);
        return response;
}

//votes
export async function postVotes(token: any, rating: any, productId: String) {
        const productData = {
                token: token,
                rating: rating,
                productId: productId
        };
        const data = await getValue("accessToken");
        if(!data)
                return null;
        const { accessToken } = data;
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
                body: JSON.stringify(productData)
        };
        const response = await fetch(baseURL + '/votes', requestOptions);
        console.log(response.status);
        return response;
}

//get user detail
export async function getUser() {
        const data = await getValue("accessToken");
        if(!data)
                return null;
        const { accessToken } = data;
        const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken },
            };
        const response = await fetch(baseURL + '/users/me', requestOptions);
        console.log(response.status);
        return response;
}