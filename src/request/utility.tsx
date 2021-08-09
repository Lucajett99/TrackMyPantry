import { Storage } from '@capacitor/storage';

export const addDays = (date: Date, days: any) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const setToken = async (token: any) => {
    await Storage.set({
      key: 'accessToken',
      value: JSON.stringify(token),
    });

};

export const setDate = async () => {
    const date: Date =  new Date();
    await Storage.set({
      key: 'date',
      value: JSON.stringify(date),
    });

};

export const getToken = async () => {
    const { value } = await Storage.get({ key: 'accessToken' });
    return value ? JSON.parse(value) : null;
};

export const getDate = async () => {
    const { value } = await Storage.get({ key: 'date' });
    return value ? JSON.parse(value) : null;
};