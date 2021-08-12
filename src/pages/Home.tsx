import { IonButton, IonItem, IonLabel, IonAlert, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput, useIonViewWillEnter } from "@ionic/react";
import { addOutline, closeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getProducts } from "../request/API";
import Card from '../components/Card';
import NewProduct from "../components/NewProduct";
import { Plugins, Capacitor } from '@capacitor/core';
import { SQLiteConnection } from '@capacitor-community/sqlite';
import { Storage } from '@capacitor/storage';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { plugins } from "pretty-format";

const { CapacitorSQLite } = Plugins;


const Home: React.FC = () => {
    //const barcode = '8000500310427'; //nutella biscuits
    const [cards, setCards] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [sessionToken, setSessionToken] = useState<String>("");
    const [newP, setNewP] = useState<Boolean>(false)

    /*useEffect(() => {
        const initdb = async() => {
            //get plugin
            const mySQLite = new SQLiteConnection(CapacitorSQLite);

            const db: any = await mySQLite.createConnection("test-db", false, "no-encryption", 1);
            setMessage(JSON.stringify(db, null, 3));
            setAlert(true);
        };
        initdb().then(() => {
            console.log('inizialized');
        });        
    }, [])*/

    const closeModal = async () => {
        setShowModal(false);
        setProducts([]);
    }

    const checkProduct = async () => {
        if(showModal) {
            const barcode = document.getElementById("input-barcode") ? (document.getElementById("input-barcode") as HTMLInputElement).value : null;
            if(barcode) {
                const response = await getProducts(barcode);
                if(response && response.ok) {
                    const data = await response.json();
                    if(data.products.length > 0) {
                        const tmp: any = [];
                        data.products.forEach((product: any) => {
                            tmp.push(
                                <Card name={product.name} type={product.description} quantity={product.barcode}/>
                            )
                        })
                        setSessionToken(data.token);
                        tmp.push(<IonButton onClick={() => setNewP(true)}> Add new product </IonButton>)
                        setProducts(tmp);
                        setModalContent(<IonContent><IonList> {tmp} </IonList></IonContent>);
                    }
                    else {
                        setMessage("The product you are looking for is not present, do you want to add it?");
                        setAlert(true);
                        setSessionToken(data.token);
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

    const [modalContent, setModalContent] = useState<any>();
    const base = (
        <IonContent>
            <IonItem style={{marginTop: "40%", marginBottom: "40%"}}>
                <IonLabel position="floating"> Barcode </IonLabel>
                <IonInput
                    type="text"
                    id="input-barcode"
                    color="primary"
                    style={{backgroundColor: "white"}}
                />
            </IonItem>
            <IonButton onClick={checkProduct}>CHECK</IonButton>
        </IonContent>
    );

    useEffect(() => {
        if(showModal)
            setModalContent(base);
    }, [showModal]);

    useEffect(() => {
        console.log(sessionToken);
        if(newP)
            setModalContent(<NewProduct sessionToken={sessionToken} closeModal={closeModal} setNewP={setNewP}/>);
        else
            setModalContent(base);
    }, [newP]);

    return(
        <IonPage>
            <IonAlert
                    isOpen={alert}
                    onDidDismiss={() => setAlert(false)}
                    cssClass="my-custom-class"
                    header={"Alert!"}
                    message={message}
                    buttons={[{ text: 'Yes', handler: () => setNewP(true) }, "No"]}
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
                    {modalContent}
                </IonModal>
            </IonContent>
        </IonPage>
    );
};
export default Home;
