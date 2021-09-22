import { Storage } from '@capacitor/storage';
import { Camera, CameraResultType, CameraPluginPermissions, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { isPlatform } from "@ionic/react";
export interface productData {
  id: string;
  barcode: string;
  name: string;
  description: string;
  image: string;
  email: string;
}

/**
 * This function is used to set values in the storage
 * @param key a string (ex: email)
 * @param value a string (ex: mariorossi@gmail.com)
 */
export const setValue = async (key: string, value: any) => {
    await Storage.set({
      key: key,
      value: JSON.stringify(value),
    });
};

/**
 * This function is used to get values in the storage
 * @param key a string (ex: email)
 * @returns the value of the key (ex: mariorossi@gmail.com)
 */
export const getValue = async (key: string) => {
    const { value } = await Storage.get({ key: key });
    return value ? JSON.parse(value) : null;
};

/**
 * This function is used to remove a key in the storage
 */
export const removeKey = async (key: string) => {
  await Storage.remove({key});
}

/**
 * This function is used to check if the user is authenticated
 * @returns a boolean, true if authenticated false otherwise
 */
 export const isAuthed = async () =>{
  const token = await getValue("accessToken");
  const date = new Date(await getValue("date"));
  const today = new Date();
  date.setDate(date.getDate() + 7);
  //check that 7 days have not passed since the last login
  if(token != null && date.getTime() > today.getTime())
    return true;
  else
    return false;
}

/**
 * This function is used to open the camera for taking photos
 * @returns the base64 string of the photo
 */
export const openCamera = async () => {
  try {
    const { camera: hasAlreadyPermission } = await Camera.checkPermissions();
    // If the user hasn't already granted the permissions for the Camera or has
    // granted a one time only permission before, ask again permissions
    if (hasAlreadyPermission !== "granted" && !isPlatform("mobileweb")) {
      const { camera } = await Camera.requestPermissions({
        permissions: ["camera"],
      });
      // Checks the request status, if denied simply returns
      if (camera === "denied") return;
    }
    // We have now permission to access the Camera
    const photo = await Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      // Not interested in the user gallery
      source: CameraSource.Camera,
      webUseInput: true,
    });

    return photo.base64String;
  } catch (error: any) {
    // Presents an error message to the user
    throw Error(error);
  }
};

/**
 * This function is used to open the camera for barcode scanning
 * @returns the barcode string
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
  } catch (err: any) {
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

/**
 * This function is used to close the camera for barcode scanning
 */
export const stopScan = () => {
  document.body.style.background = "";
  document.body.style.opacity = "1";
  BarcodeScanner.showBackground();
  BarcodeScanner.stopScan();
};

