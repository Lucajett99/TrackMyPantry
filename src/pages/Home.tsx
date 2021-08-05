import { IonButton, IonItem, IonLabel, IonIcon, IonPage, IonFab, IonFabButton, IonList, IonItemSliding, IonItemOptions, IonItemOption } from "@ionic/react";
import { addOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { getProducts, usersMe } from "../request/API";
import Card from '../components/Card';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';


const Home: React.FC = () => {
    const barcode = '8000500310427'; //nutella biscuits
    const products = [{name: "Nutella", type: "dolce", quantity: 2}, {name: "Ketchup", type: "salsa", quantity: 5}, {name: "Fettina", type: "carne", quantity: 1}];
    const cards: any = [];

    
    useEffect(() => {
        (async () => {
            const products = await getProducts(barcode);
            if(!products)
                return;
            const data = await products.json();
            console.log(data);
        })();
    },[]);

    products.forEach((product) => {
        cards.push(
            <Card name={product.name} type={product.type} quantity={product.quantity}/>
        );
    });

    const addProduct = async () => {
        BarcodeScanner.hideBackground(); // make background of WebView transparent

        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
      
        // if the result has content
        if (result.hasContent) {
          console.log(result.content); // log the raw scanned content
        }
    }
    
    /*const [scan, setScan] = useState({stringEncoded: ""});

    const dataToScan = async () => {
        const data = await BarcodeScanner.scan();
        alert(JSON.stringify(data));
        setScan({stringEncoded: data.text});
      };
  
      const createCode = () => {
        BarcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, "Hello World!")
          .then(data => {
            console.log(data);
          }, error => {
            console.log("Error : " + error);
          });
      };*/
    
    return(
        <IonPage>
            <IonList>
                {cards}
            </IonList>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton size="small" onClick={addProduct}>
                    <IonIcon icon={addOutline} />
                </IonFabButton>
            </IonFab>
        </IonPage>
    );
};
export default Home;
