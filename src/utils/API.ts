import { setValue, getValue } from './utility';
const baseURL = 'https://lam21.modron.network';

/**
 * This function makes an http call to login
 * @param email the e-mail of the user who wants to authenticate
 * @param password the password of the user who wants to authenticate
 * @returns the response of the http call
 */
export async function login(email: string, password: string) {
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
        await setValue("email", email);
        await setValue("date", new Date());
    }
    return response;
}

/**
 * This function makes an http call to register
 * @param username the username of the user who wants to register
 * @param email the e-mail of the user who wants to register
 * @param password the password of the user who wants to register
 * @returns the response of the http call
 */
export async function register(username: string, email: string, password: string) {
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

/**
 * This function makes an http call to return products with a certain barcode
 * @param barcode the barcode of the product we want to search for
 * @returns the response of the http call
 */
export async function getProducts(barcode: string) {
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

/**
 * This function makes an http call to add a new product on the web server
 * @param sessionToken the sessionToken of the product
 * @param name the name of the product
 * @param description the description of the product
 * @param barcode the barcode of the product
 * @param test
 * @param image the base64 string of the product (if it is present)
 * @returns the response of the http call
 */
export async function postProduct(sessionToken: string, name: string, description: string, barcode: string, test: boolean, image?: any) {
    const productData = {
        token: sessionToken,
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

/**
 * This function makes an http call to vote for the chosen product
 * @param token the token of the product
 * @param rating the rating of the product
 * @param productId the id of the product
 * @returns the response of the http call
 */
export async function postVotes(token: string, rating: number, productId: string) {
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
