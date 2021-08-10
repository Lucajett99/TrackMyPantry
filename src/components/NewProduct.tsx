import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { postProduct } from '../request/API';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';

interface ProductProps {
    sessionToken: String;
}

const NewProduct: React.FC<ProductProps> = ({sessionToken}) => {
  const [barcode, setBarcode] = useState<string>("0000000000");
  const [name, setName] = useState<string>("xxxxxxxx");
  const [description, setDescription] = useState<string>("xxxxxxxx");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleLogin = async () => {
    if (!barcode) {
        setMessage("Please enter a valid barcode");
        setIserror(true);
        return;
    }
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

    const response = await postProduct(sessionToken, name, description, barcode, true);
    if(response.ok) {
      const data = await response.json();
      console.log(data);
    }
    else {
      setMessage(response.status.toString());
      setIserror(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonGrid>
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
            <IonIcon
                style={{ fontSize: "70px", color: "#0040ff" }}
                icon={personCircle}
            />
          </IonCol>
        </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
            <IonLabel position="floating"> Barcode</IonLabel>
            <IonInput
                type="text"
                value={barcode}
                onIonChange={(e) => setBarcode(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
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
                >
              </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
            <IonItem>
              <IonLabel position="floating"> Description</IonLabel>
              <IonInput
                type="text"
                value={description}
                onIonChange={(e) => setDescription(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default NewProduct;