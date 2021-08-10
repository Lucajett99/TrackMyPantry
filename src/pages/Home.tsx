import { IonButton, IonItem, IonLabel, IonAlert, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput } from "@ionic/react";
import { addOutline, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { getProducts } from "../request/API";
import Card from '../components/Card';
import { Storage } from '@capacitor/storage';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import NewProduct from "../components/NewProduct";

const Home: React.FC = () => {
    //const barcode = '8000500310427'; //nutella biscuits
    const [cards, setCards] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [newP, setNewP] = useState<Boolean>(false);

    const closeModal = async () => {
        setShowModal(false);
        setProducts([]);
    }

    const addProduct = () => {

    }

    const checkProduct = async () => {
        if(showModal) {
            const barcode = document.getElementById("input-barcode") ? (document.getElementById("input-barcode") as HTMLInputElement).value : null;
            if(barcode) {
                const response = await getProducts(barcode);
                if(response && response.ok) {
                    const data = await response.json();
                    if(data.products.lenght > 0) {
                        const tmp: any = [];
                        data.products.forEach((product: any) => {
                            tmp.push(
                                <Card name={product.name} type={product.description} quantity={product.barcode}/>
                            )
                        })
                        setProducts(tmp);
                        console.log(data);
                    }
                    else {
                        setMessage("The product you are looking for is not present, do you want to add it?");
                        setAlert(true);
                        const sessionToken = data.token;
                        //addProduct(barcode, sessionToken);
                    }
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
            <IonAlert
                    isOpen={alert}
                    onDidDismiss={() => setAlert(false)}
                    cssClass="my-custom-class"
                    header={"Alert!"}
                    message={message}
                    buttons={[{ text: 'Yes', handler: addProduct }, "No"]}
            />
            <IonContent>
                <IonList>
                    {cards}
                </IonList>
            </IonContent>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton size="small" onClick={() => setShowModal(true)}>
                    <IonIcon icon={addOutline} />
                </IonFabButton>
            </IonFab>
            <IonContent>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    <IonFab vertical="top" horizontal="end" slot="fixed">
                        <IonFabButton size="small" onClick={closeModal}>
                            <IonIcon icon={closeOutline} />
                        </IonFabButton>
                    </IonFab>
                    <IonContent id="products-list" style={{overflow: "hidden"}}>
                        { !products.length ?
                            <IonItem style={{marginTop: "40%", marginBottom: "40%"}}>
                                <IonLabel position="floating"> Barcode </IonLabel>
                                <IonInput
                                    type="text"
                                    id="input-barcode"
                                    color="primary"
                                    style={{backgroundColor: "white"}}
                                />
                            </IonItem>
                        : <IonList> {products} </IonList>}
                    </IonContent> 
                    <IonButton onClick={checkProduct}>CHECK</IonButton>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};
export default Home;
