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
 */
export const removeKey = async (key: string) => {
  await Storage.remove({key});
}

/**
 * 
 * @returns 
 */
export const checkPermission = async () => {
  const permission = await Camera.checkPermissions();
  return permission;
}

/**
 * 
 * @returns 
 */
export const requestPermission = async () => {
  const permissions: CameraPluginPermissions = {permissions : ['camera', 'photos']}
  const response = await Camera.requestPermissions(permissions);
  return response;
}

/**
 * 
 * @returns 
 */
export const takePicture = async () => {
  try {
    const permission = await checkPermission();
    if(permission.camera == 'granted') {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
      return image.base64String;
    }
    else {
      await requestPermission();
      await takePicture();
    }
  } catch(error) {
    throw Error("Permission Error");
  }
};

