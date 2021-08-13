import { Storage } from '@capacitor/storage';

export const setValue = async (key: string, value: any) => {
    await Storage.set({
      key: key,
      value: JSON.stringify(value),
    });

};

export const getValue = async (key: string) => {
    const { value } = await Storage.get({ key: key });
    return value ? JSON.parse(value) : null;
};
