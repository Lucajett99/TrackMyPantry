import { Storage } from '@capacitor/storage';
import { Camera, CameraResultType } from '@capacitor/camera';

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

export const checkPermission = async () => {
  const permission = await Camera.checkPermissions();
  return permission;
}

export const requestPermission = async () => {
  const permission = await Camera.requestPermissions();
  return permission;
}

export const takePicture = async () => {
  const permission = await checkPermission();
  if(permission.camera == 'granted') {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
    return image;
  }
  else if(permission.camera == 'denied')
    return;
  else {
    await requestPermission();
    await takePicture();
  }
};

