import { IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonAlert, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonFooter, useIonLoading, IonSearchbar } from "@ionic/react";
import { addOutline, closeOutline, searchCircleOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getProducts } from "../request/API";
import { onStartScan } from '../request/utility';
import { initDatabase, QueryGetProducts } from "../request/Database";
import Card from '../components/Card';
import LocalCard from '../components/LocalCard';
import NewProduct from "../components/NewProduct";
import { useHistory } from "react-router";

const Home: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<any>("");
    const [sessionToken, setSessionToken] = useState<String>("");
    const [barcode, setBarcode] = useState<String>("");
    const [newP, setNewP] = useState<Boolean>(false);
    const [searchText, setSearchText] = useState('');
    const [queryResults, setQueryResults] = useState<any>(null);
    const [products, setProducts] = useState<any>(null);
    const [show, dismiss] = useIonLoading();
    const history = useHistory();
    
    const setHome = async () => {
        await initDatabase();
        const query = await QueryGetProducts();
        await setQueryResults(query);
        await setProducts(query?.values);
    };     

    const closeModal = async () => {
        setNewP(false);
        setShowModal(false);
    }

    const handleBarcodeScanner = async () => {
        const {error, result} = await onStartScan();
        if(error)
            setMessage(result);
        else if(result)
            checkProduct(result);
    };

    const checkProduct = async (scanner?: any) => {
        if(showModal) {
            show("Loading");
            const myBarcode = document.getElementById("input-barcode") ? (document.getElementById("input-barcode") as HTMLInputElement).value : null;
            if(myBarcode) {
                const response = await getProducts(myBarcode);
                if(response?.ok) {
                    const data = await response.json();
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
                        await setModalContent(<IonContent><IonGrid> {tmp} </IonGrid></IonContent>);
                    }
                    else {
                        setMessage("The product you are looking for is not present, do you want to add it?");
                        setAlert(true);
                        setSessionToken(data.token);
                        setBarcode(myBarcode);
                    }
                }
                else {
                    setMessage(response?.status.toString());
                    setAlert(true);
                }
            }
            dismiss();
        }
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
                            color="dark"
                        />
                    </IonCol>
                    <IonCol>
                        <IonButton
                            color="dark"
                            onClick={handleBarcodeScanner}
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
        setHome();
    }, []); 

    useEffect(() => {
        if(searchText) {
            const tmp: any = [];
            queryResults?.values?.forEach((product: any) => {
                if(product.name.toLowerCase() === searchText.toLowerCase())
                    tmp.push(product);
            });
            setProducts(tmp);
        }
        else {
            setProducts(queryResults?.values);
        }
    }, [searchText])

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
                            <IonSearchbar searchIcon={searchCircleOutline} value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="always" />
                        </IonCol>
                    </IonRow>
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
                                {products?.map((product: any) => {
                                    return <LocalCard id={product.id} barcode={product.barcode} name={product.name} description={product.description} image={product.image} quantity={product.quantity} setProducts={setProducts}/>
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
                </IonModal>
            </IonContent> 
        </IonPage>
    );
};
export default Home;
