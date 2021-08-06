import { IonButton, IonItem, IonLabel, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput } from "@ionic/react";
import { addOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { getProducts, usersMe } from "../request/API";
import Card from '../components/Card';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const Body: React.FC<{
    count: number;
    onDismiss: () => void;
    onIncrement: () => void;
  }> = ({ count, onDismiss, onIncrement }) => (
    <div>
      count: {count}
      <IonButton expand="block" onClick={() => onIncrement()}>
        Increment Count
      </IonButton>
      <IonButton expand="block" onClick={() => onDismiss()}>
        Close
      </IonButton>
    </div>
);

const Home: React.FC = () => {
    //const barcode = '8000500310427'; //nutella biscuits
    const products = [{name: "Nutella", type: "dolce", quantity: 2}, {name: "Ketchup", type: "salsa", quantity: 5}, {name: "Fettina", type: "carne", quantity: 1}];
    const [cards, setCards]: any = useState([]);
    const [showModal, setShowModal] = useState(false);


    const addProduct = async () => {
        if(showModal) {
            const barcode = (document.getElementById("input-barcode") as HTMLInputElement).value;
            const response = await getProducts(barcode);
            if(response && response.ok) {
                const data = await response.json();
                data.products.forEach((product: any) => {
                    cards.push(
                        <Card name={product.name} type={product.description} quantity={product.barcode}/>
                    )
                })
                console.log(data);
            }
            setShowModal(false);
        }

        /*BarcodeScanner.hideBackground(); // make background of WebView transparent
        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
        // if the result has content
        if (result.hasContent) {
          console.log(result.content); // log the raw scanned content
        }*/
    }
    
    return(
        <IonPage>
            <IonList>
                {cards}
            </IonList>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton size="small" onClick={() => setShowModal(true)}>
                    <IonIcon icon={addOutline} />
                </IonFabButton>
            </IonFab>
            <IonContent>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    <IonItem style={{marginTop: "40%", marginBottom: "40%"}}>
                        <IonLabel position="floating"> Barcode </IonLabel>
                        <IonInput
                            type="text"
                            id="input-barcode"
                            color="primary"
                            style={{backgroundColor: "white"}}
                        />
                    </IonItem>
                    <IonButton onClick={addProduct}>ADD</IonButton>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};
export default Home;
