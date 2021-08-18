import { IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonAlert, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonFooter, useIonLoading } from "@ionic/react";
import { addOutline, closeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getProducts } from "../request/API";
import { initDatabase, QueryGetProducts } from "../request/Database";
import Card from '../components/Card';
import LocalCard from '../components/LocalCard';
import NewProduct from "../components/NewProduct";
import { Plugins, Capacitor } from '@capacitor/core';
import { SQLiteConnection } from '@capacitor-community/sqlite';
import { Storage } from '@capacitor/storage';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useHistory } from "react-router";

const { CapacitorSQLite } = Plugins;
const mySQLite = new SQLiteConnection(CapacitorSQLite);


const Home: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [sessionToken, setSessionToken] = useState<String>("");
    const [barcode, setBarcode] = useState<String>("");
    const [newP, setNewP] = useState<Boolean>(false);
    const [queryResults, setQueryResults] = useState<any>(null);
    const [show, dismiss] = useIonLoading();
    const history = useHistory();
    
    const setHome = async () => {
        await initDatabase();
        const query = await QueryGetProducts();
        setQueryResults(query);
    };

    useEffect(() => {
        setHome();
    }, []);      

    const closeModal = async () => {
        setNewP(false);
        setShowModal(false);
        setProducts([]);
    }

    const checkProduct = async () => {
        show("Loading");
        if(showModal) {
            const myBarcode = document.getElementById("input-barcode") ? (document.getElementById("input-barcode") as HTMLInputElement).value : null;
            if(myBarcode) {
                const response = await getProducts(myBarcode);
                if(response?.ok) {
                    const data = await response.json();
                    console.log(data);
                    if(data.products.length > 0) {
                        const tmp: any = [];
                        data.products.forEach((product: any) => {
                            tmp.push(
                                <Card barcode={product.barcode} id={product.id} sessionToken={data.token} name={product.name} description={product.description} image={product.img} setQueryResult={setQueryResults} closeModal={closeModal}/>
                            )
                        })
                        setSessionToken(data.token);
                        setBarcode(myBarcode);
                        tmp.push(<IonRow style={{textAlign: "center"}}><IonCol><IonButton onClick={() => setNewP(true)}> Add new product </IonButton></IonCol></IonRow>)
                        setProducts(tmp);
                        setModalContent(<IonContent><IonGrid> {tmp} </IonGrid></IonContent>);
                    }
                    else {
                        setMessage("The product you are looking for is not present, do you want to add it?");
                        setAlert(true);
                        setSessionToken(data.token);
                        setBarcode(myBarcode);
                    }
                }
            }
            dismiss();
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
            setModalContent(<NewProduct sessionToken={sessionToken} barcode={barcode} closeModal={closeModal} setNewP={setNewP}/>);
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
                                {queryResults?.values?.map((product: any) => {
                                    return <LocalCard id={product.id} barcode={product.barcode} name={product.name} description={product.description} image={product.image} quantity={product.quantity} setQueryResult={setQueryResults}/>
                                })}
                            </IonList>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton size="small" onClick={() => setShowModal(true)}>
                        <IonIcon icon={addOutline} />
                    </IonFabButton>
                </IonFab>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    <IonFab vertical="top" horizontal="end" slot="fixed">
                        <IonFabButton size="small" onClick={closeModal}>
                            <IonIcon icon={closeOutline} />
                        </IonFabButton>
                    </IonFab>
                    {modalContent}
                    <IonFooter>
                        <IonToolbar>
                            <IonTitle class="ion-text-center">Add a product</IonTitle>
                        </IonToolbar>
                    </IonFooter>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};
export default Home;
