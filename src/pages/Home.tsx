import { IonButton, IonItem, IonLabel, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput } from "@ionic/react";
import { addOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { getProducts, usersMe } from "../request/API";
import { getToken } from '../request/utility';
import Card from '../components/Card';
import { Storage } from '@capacitor/storage';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const Home: React.FC = () => {
    //const barcode = '8000500310427'; //nutella biscuits
    const [cards, setCards] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
        setProducts([]);
    }

    const addProduct = (product: any) => {
        const tmp: any = cards;
        tmp.push(product);
        setCards(tmp);
    }

    const checkProduct = async () => {
        if(showModal) {
            const barcode = document.getElementById("input-barcode") ? (document.getElementById("input-barcode") as HTMLInputElement).value : null;
            if(barcode) {
                const response = await getProducts(barcode);
                if(response && response.ok) {
                    const data = await response.json();
                    const tmp: any = [];
                    data.products.forEach((product: any) => {
                        tmp.push(
                            <Card name={product.name} type={product.description} quantity={product.barcode}/>
                        )
                    })
                    setProducts(tmp);
                    console.log(data);
                }
            }
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
                <IonFabButton size="small" onClick={() => Storage.clear()}>
                    <IonIcon icon={addOutline} />
                </IonFabButton>
            </IonFab>
            <IonContent>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    <IonItem style={{marginTop: "0%", marginBottom: "0%"}}>
                        <IonLabel position="floating"> Barcode </IonLabel>
                        { !products.length ? <IonInput
                            type="text"
                            id="input-barcode"
                            color="primary"
                            style={{backgroundColor: "white"}}
                        /> : products }
                    </IonItem> 
                    <IonButton onClick={checkProduct}>CHECK</IonButton>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};
export default Home;
