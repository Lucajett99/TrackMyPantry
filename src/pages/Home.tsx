import { IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonAlert, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonFooter } from "@ionic/react";
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
import { useHistory } from "react-router";

const { CapacitorSQLite } = Plugins;


const Home: React.FC = () => {
    //const barcode = '8000500310427'; //nutella biscuits
    //const tmp : any= [<p>ciao1</p>, <p>ciao2</p>, <p>ciao3</p>, <p>ciao4</p>];
    const [cards, setCards] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [sessionToken, setSessionToken] = useState<String>("");
    const [newP, setNewP] = useState<Boolean>(false)
    const history = useHistory();
 
    useEffect(() => {
        const initdb = async() => {
            //get plugin
            const mySQLite = new SQLiteConnection(CapacitorSQLite);

            const db = await mySQLite.createConnection("test-db", false, "no-encryption", 1);
            mySQLite.importFromJson("");
            setMessage(JSON.stringify(db, null, 3));
            setAlert(true);
        };
        initdb().then(() => {
            console.log('inizialized');
        });        
    }, []);

    const closeModal = async () => {
        setNewP(false);
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
                                <Card name={product.name} description={product.description} quantity={product.barcode}/>
                            )
                        })
                        setSessionToken(data.token);
                        tmp.push(<IonRow style={{textAlign: "center"}}><IonCol><IonButton onClick={() => setNewP(true)}> Add new product </IonButton></IonCol></IonRow>)
                        setProducts(tmp);
                        setModalContent(<IonContent><IonGrid> {tmp} </IonGrid></IonContent>);
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
        <IonContent fullscreen className="ion-padding ion-text-center">
            <IonGrid style={{marginTop: "40%"}}>
                <IonRow>
                    <IonCol>
                        <IonLabel position="floating"> Barcode </IonLabel>
                        <IonInput
                            type="text"
                            id="input-barcode"
                            color="primary"
                            style={{backgroundColor: "white"}}
                        />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton onClick={checkProduct}>CHECK</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );

    useEffect(() => {
        if(showModal)
            setModalContent(base);
    }, [showModal]);

    useEffect(() => {
        if(newP)
            setModalContent(<NewProduct sessionToken={sessionToken} closeModal={closeModal} setNewP={setNewP}/>);
        else
            setModalContent(base);
    }, [newP]);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">Tracking My Pantry</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonAlert
                                    isOpen={alert}
                                    onDidDismiss={() => setAlert(false)}
                                    cssClass="my-custom-class"
                                    header={"Alert!"}
                                    message={message}
                                    buttons={[{ text: 'Yes', handler: () => setNewP(true) }, "No"]}
                            />
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol>
                            <IonList>
                                {cards}
                            </IonList>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab vertical="bottom" horizontal="end">
                    <IonFabButton size="small" onClick={() => setShowModal(true)}>
                        <IonIcon icon={addOutline} />
                    </IonFabButton>
                </IonFab>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    <IonFooter>
                        <IonToolbar>
                            <IonTitle class="ion-text-center">Add a product</IonTitle>
                        </IonToolbar>
                    </IonFooter>
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
