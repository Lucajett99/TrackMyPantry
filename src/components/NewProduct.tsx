import { IonContent, IonPage, IonFab, IonFabButton, IonTextarea, IonImg } from '@ionic/react';
import React, { useState } from 'react';
import { postProduct } from '../utils/API';
import { getValue, productData, openCamera } from '../utils/utility';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { camera, closeOutline, closeCircleOutline, imageOutline } from "ionicons/icons";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
import { QueryCreateProduct, QueryGetProducts } from '../utils/Database';
interface ProductProps {
    sessionToken: string;
    barcode: string;
    closeModal: any;
    setNewP: any;
    setProducts: any;
    setQueryResults: any;
}

const NewProduct: React.FC<ProductProps> = ({sessionToken, barcode, closeModal, setNewP, setProducts, setQueryResults}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>(null);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  //create a new product on the shared database
  const handleAddProduct = async () => {
    if (!name) {
        setMessage("Please enter the name of the product");
        setIserror(true);
        return;
    }
    if (!description) {
        setMessage("Please enter the description of the product");
        setIserror(true);
        return;
    }
    //calls the function that makes the http call that adds a product to the shared database
    const response = await postProduct(sessionToken, name, description, barcode, true, image ? image : null);
    if(response) {
      if(response.ok) {
        const responseJson = await response.json();
        const email = await getValue("email");
        const id = responseJson.id;
        const data: productData = { id, barcode, name, description, image, email };
        //query that adds the product to the local database
        await QueryCreateProduct(data);
        //update the products in the home
        const products = await QueryGetProducts(email);
        await setQueryResults(products);
        await setProducts(products?.values);
        //it is used to change the contents of the modal window
        setNewP(false);
      }
      else {
        setMessage(response.statusText ? response.statusText : "Status code: " + response.status.toString());
        setIserror(true);
      }
    }
  };

  //opens the camera
  const handlePicture = async () => {
    const img = await openCamera();
    if(img)
      setImage(img);
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
      <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton size="small" onClick={closeModal}>
              <IonIcon icon={closeOutline} />
          </IonFabButton>
      </IonFab>
        <IonGrid style={{marginTop: "40%"}}>
        <IonRow>
          <IonCol>
            <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass="my-custom-class"
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
            />
          </IonCol>
        </IonRow>
        <IonRow>
            <IonCol>
                {image ? <IonImg src={"data:image/jpeg;base64," + image} /> : <IonIcon size="large" icon={imageOutline}/>}
            </IonCol>
            <IonCol>
              <IonFab vertical="center" horizontal="center">
                  <IonFabButton size="small" color="dark" onClick={handlePicture}>
                      <IonIcon icon={camera} />
                  </IonFabButton>
              </IonFab>
            </IonCol>
            <IonCol>
              <IonFab vertical="center" horizontal="center">
                  <IonFabButton size="small" color="dark" onClick={() => setImage(null)}>
                      <IonIcon icon={closeCircleOutline} />
                  </IonFabButton>
              </IonFab>
            </IonCol>
          </IonRow>
        <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Name</IonLabel>
                <IonInput
                  type="text"
                  value={name}
                  onIonChange={(e) => setName(e.detail.value!)}
                />
            </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Description</IonLabel>
                <IonTextarea value={description} onIonChange={(e) => setDescription(e.detail.value!)}/>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton onClick={handleAddProduct} color="dark"> ADD </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NewProduct;