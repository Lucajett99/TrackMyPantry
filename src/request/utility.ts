import { Storage } from '@capacitor/storage';
import { Camera, CameraResultType, CameraPluginPermissions } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

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

/**
 * 
 */
export const onStartScan = async () => {
  let data: any = {error: false, result: null}
  try {
      // Ask and check for user permission
      const { granted } = await BarcodeScanner.checkPermission({ force: true });
      if (!granted) throw Error("Permission Error");

      // Hides all the WebView from user eyes, in order to let the user
      // see the ScannerView below
      document.body.style.background = "transparent";
      document.body.style.opacity = "0";
      BarcodeScanner.hideBackground();

      // Start scanning and wait for a result
      const result = await BarcodeScanner.startScan();

      // If the result has content, then updates the product hint
      if (result.hasContent)
        data = {error: false, result: result.content}
  } catch (err) {
      // Presents an error message to the user
      data = {error: true, result: err.message}
  } finally {
      // Reverts the WebView to the previous settings
      document.body.style.background = "";
      document.body.style.opacity = "1";
      BarcodeScanner.showBackground();
  }
  return data;
};
