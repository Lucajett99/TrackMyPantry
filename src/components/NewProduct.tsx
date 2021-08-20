import { IonContent, IonPage, IonFab, IonFabButton, IonTextarea, IonImg, useIonLoading } from '@ionic/react';
import React, { useState } from 'react';
import { postProduct } from '../request/API';
import { takePicture } from '../request/utility';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { camera, closeOutline, closeCircleOutline } from "ionicons/icons";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
interface ProductProps {
    sessionToken: String;
    barcode: String;
    closeModal: any;
    setNewP: any;
}

const NewProduct: React.FC<ProductProps> = ({sessionToken, barcode, closeModal, setNewP}) => {
  const [name, setName] = useState<string>("xxxxxxxx");
  const [description, setDescription] = useState<string>("xxxxxxxx");
  const [image, setImage] = useState<any>(null);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [show, dismiss] = useIonLoading();

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

    show("Loading");
    const response = await postProduct(sessionToken, name, description, barcode, true, image ? image : null);
    if(response) {
      console.log(response.ok)
      if(response.ok) {
        const data = await response.json();
        console.log(data);
        setNewP(false);
      }
      else {
        setMessage(response.status.toString());
        setIserror(true);
      }
    }
    dismiss();
  };

  const handlePicture = async () => {
    const img = await takePicture();
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
              <IonItem>
                <IonImg src={image ? "data:image/jpeg;base64," + image : '#'} />
              </IonItem>
            </IonCol>
            <IonCol>
              <IonFab vertical="center" horizontal="center">
                  <IonFabButton size="small" onClick={handlePicture}>
                      <IonIcon icon={camera} />
                  </IonFabButton>
              </IonFab>
            </IonCol>
            <IonCol>
              <IonFab vertical="center" horizontal="center">
                  <IonFabButton size="small" onClick={() => setImage(null)}>
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
        <IonButton onClick={handleAddProduct}>ADD</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NewProduct;