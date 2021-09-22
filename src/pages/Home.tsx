import { IonGrid, IonRow, IonCol, IonButton, IonItem, IonLabel, IonAlert, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonModal, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonSearchbar } from "@ionic/react";
import { addOutline, barcodeOutline, basketOutline, cameraOutline, closeOutline, searchCircleOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { getProducts } from "../utils/API";
import { onStartScan, stopScan, getValue } from '../utils/utility';
import { initDatabase, QueryGetProducts } from "../utils/Database";
import Card from '../components/Card';
import LocalCard from '../components/LocalCard';
import NewProduct from "../components/NewProduct";

const Home: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<any>(); //the contents of the modal window
    const [alert, setAlert] = useState<boolean>(false);
    const [alert2, setAlert2] = useState<boolean>(false);
    const [message, setMessage] = useState<any>("");
    const [sessionToken, setSessionToken] = useState<string>("");
    const [barcode, setBarcode] = useState<string>("");
    const [newP, setNewP] = useState<boolean>(false); //is the state used to create a new product
    const [searchText, setSearchText] = useState('');
    const [queryResults, setQueryResults] = useState<any>(null);
    const [products, setProducts] = useState<any>(null); //is the state that contains the products to be displayed on the home                    

    //to initialize and set the home
    const setHome = async () => {
        //initializes the database
        await initDatabase();
        //get all products of the current user
        const query = await QueryGetProducts(await getValue("email"));
        //store the query result
        setQueryResults(query);
        //set the products to be displayed
        setProducts(query?.values);
    };     

    const closeModal = async () => {
        setNewP(false);
        setShowModal(false);
    }

    //to call the barcode scanner
    const handleBarcodeScanner = async () => {
        const {error, result} = await onStartScan();
        if(error) {
            setMessage(result);
            setAlert2(true);
        }
        else if(result)
            checkProduct(result);
    };

    //filter products by name
    const handleSearch = async () => {
        if(searchText) {
            const query = searchText.toLowerCase();
            const tmp: any = [];
            queryResults?.values?.forEach((product: any) => {
                const shouldShow = product.name.toLowerCase().indexOf(query) > -1;
                if(shouldShow)
                    tmp.push(product);
            });
            setProducts(tmp);
        }
        else {
            setProducts(queryResults?.values);
        }
    }

    //search for products in the shared database
    const checkProduct = async (scanner?: string) => {
        if(showModal) {
            const myBarcode = scanner ? scanner : (document.getElementById("input-barcode") as HTMLInputElement).value;
            if(myBarcode) {
                //http request for get products by barcode
                const response = await getProducts(myBarcode);
                if(response?.ok) {
                    const data = await response.json();
                    //if there is at least one product with that barcode
                    if(data.products.length > 0) {
                        const tmp: any = [];
                        data.products.forEach((product: any, index: number) => {
                            tmp.push(
                                <Card key={product.id} barcode={product.barcode} id={product.id} sessionToken={data.token} name={product.name} description={product.description} image={product.img} setProducts={setProducts} setQueryResults={setQueryResults} closeModal={closeModal}/>
                            )
                        })
                        //save the session token in case the user wants to create a new product
                        setSessionToken(data.token);
                        //save the barcode
                        setBarcode(myBarcode);
                        //add a button for create new product
                        tmp.push(<IonRow style={{textAlign: "center"}}><IonCol><IonButton color="dark" onClick={() => setNewP(true)}> Add new product </IonButton></IonCol></IonRow>)
                        //sets the content of the modal with all found products
                        await setModalContent(<IonContent><IonGrid> {tmp} </IonGrid></IonContent>);
                    }
                    //if there is no product with that barcode
                    else {
                        setMessage("The product you are looking for is not present, do you want to add it?");
                        setAlert(true);
                        //save the session token in case the user wants to create a new product
                        setSessionToken(data.token);
                        //save the barcode
                        setBarcode(myBarcode);
                    }
                }
                //if the http call was unsuccessful
                else {
                    setMessage(response?.status.toString());
                    setAlert2(true);
                }
            }
            //if the input field is empty
            else {
                setMessage("Please enter a valid barcode!");
                setAlert2(true);
            }
        }
    }

    //this will be the basic content of the modal window
    const base = (
        <IonContent fullscreen className="ion-padding ion-text-center">
            <IonGrid style={{marginTop: "40%"}}>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating"> Barcode </IonLabel>
                            <IonInput
                                type="text"
                                id="input-barcode"
                                color="dark"
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol size="3">
                        <IonButton size="default" onClick={handleBarcodeScanner} color="dark" style={{width: "100%", height: "90%"}}>
                            <IonIcon icon={cameraOutline}/>
                        </IonButton>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton onClick={() => checkProduct()} color="dark">CHECK</IonButton>    
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    );
 
    /*-----------------------------------------------------------USE EFFECT-----------------------------------------------------------------*/
    useEffect(() => {
        setHome();
        //stop scanning of the barcode or close the modal
        document.addEventListener('ionBackButton', (ev) => {
            stopScan();
            closeModal();
        });
    }, []);

    useEffect(() => {
        //is called when a product is searched for by name
        handleSearch();
    }, [searchText]);

    useEffect(() => {
        //every time the modal window is opened or closed it sets the basic content
        if(showModal)
            setModalContent(base);
    }, [showModal]);

    useEffect(() => {
        //if the user wants to create a new product, this sets the content of the modal window with the NewProduct component
        if(newP)
            setModalContent(<NewProduct sessionToken={sessionToken} barcode={barcode} closeModal={closeModal} setNewP={setNewP} setProducts={setProducts} setQueryResults={setQueryResults}/>);
        else
            setModalContent(base);
    }, [newP]);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center">Track My Pantry</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} />
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
                            <IonAlert
                                isOpen={alert2}
                                onDidDismiss={() => setAlert2(false)}
                                cssClass="my-custom-class"
                                header={"Alert!"}
                                message={message}
                                buttons={["Ok"]}
                            />
                        </IonCol>
                    </IonRow>
                    
                    <IonRow>
                        <IonCol>
                            <IonList id="products-list">
                               {products?.map((product: any) => {
                                    return <LocalCard key={product.id} idProduct={product.id} barcode={product.barcode} name={product.name} description={product.description} image={product.image} quantity={product.quantity} setProducts={setProducts} setQueryResults={setQueryResults}/>
                                })}
                            </IonList>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton size="small" color="dark" onClick={() => setShowModal(true)}>
                        <IonIcon icon={addOutline} />
                    </IonFabButton>
                </IonFab>
                <IonModal isOpen={showModal} cssClass='my-custom-class'>
                    <IonFab vertical="top" horizontal="end" slot="fixed">
                        <IonFabButton size="small" color="dark" onClick={closeModal}>
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
