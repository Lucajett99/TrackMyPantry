import { Storage } from '@capacitor/storage';
import { Camera, CameraResultType, CameraPluginPermissions } from '@capacitor/camera';

/**
 * 
 * @param key 
 * @param value 
 */
export const setValue = async (key: string, value: any) => {
    await Storage.set({
      key: key,
      value: JSON.stringify(value),
    });

};

/**
 * 
 * @param key 
 * @returns 
 */
export const getValue = async (key: string) => {
    const { value } = await Storage.get({ key: key });
    return value ? JSON.parse(value) : null;
};

/**
 * 
 * @returns 
 */
export const checkPermission = async () => {
  const permission = await Camera.checkPermissions();
  window.alert(JSON.stringify(permission));
  return permission;
}

/**
 * 
 * @returns 
 */
export const requestPermission = async () => {
  const permissions: CameraPluginPermissions = {permissions : ['camera', 'photos']}
  const response = await Camera.requestPermissions(permissions);
  window.alert(JSON.stringify(response));
  return response;
}

/**
 * 
 * @returns 
 */
export const takePicture = async () => {
  const permission = await checkPermission();
  if(permission.camera == 'granted') {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    return image;
  }
  else {
    await requestPermission();
    await takePicture();
  }
};

