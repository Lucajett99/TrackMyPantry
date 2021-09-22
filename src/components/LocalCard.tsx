import { IonCard, IonImg, IonRow, IonCol, IonCardHeader, IonAlert, IonCardContent, IonIcon, IonButton } from '@ionic/react';
import { addCircle, informationCircle, informationCircleOutline, removeCircle, trashBin } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { getValue } from '../utils/utility';
import { QueryDeleteProduct, QueryGetProducts, QueryAdd_DecQuantity } from '../utils/Database';

interface CardProps {
    idProduct: string;
    barcode: string;
    name: string;
    description: string;
    image: any;
    quantity: number;
    setProducts: any;
    setQueryResults: any;
}

const useStyles = createUseStyles({
  card: {
    height: "60px",
    fontSize: "10px"
  },
  image: {
    float: "right",
    height: "55px",
    width: "55px",
    marginTop: "10px"
  },
});

const LocalCard: React.FC<CardProps> = ({idProduct, barcode, name, description, image, quantity, setProducts, setQueryResults}) => {
    const [myQuantity, setMyQuantity] = useState<any>(quantity);
    const [isDescription, setIsDescription] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const classes = useStyles();
    const myImage: string = image?.includes("data:image/jpeg;base64,") ? image : "data:image/jpeg;base64," + image;
    const event = new Event('trigger'); //an event to update the shopping list

    //delete product from the local database
    const deleteProduct = async () => {
      const email = await getValue("email");
      //query that deletes the product
      await QueryDeleteProduct(idProduct, email);
      //update the products in the home
      const products = await QueryGetProducts(email);
      await setQueryResults(products);
      await setProducts(products?.values);
    }

    //increase the quantity of the product by one
    const addQuantity = async () => {
      const email =  await getValue("email");
      setMyQuantity(myQuantity + 1);
      //query that updates the quantity of the product in the local database
      await QueryAdd_DecQuantity(idProduct, myQuantity + 1, email);
    }

    //decrease the quantity of the product by one
    const decQuantity = async () => {
      const email =  await getValue("email");
      setMyQuantity(myQuantity - 1); 
      await QueryAdd_DecQuantity(idProduct, myQuantity - 1, email);
      //if the product reaches quantity = 0, it must be deleted from the home and added to the shopping list
      if(myQuantity -1 <= 0) {
        //this query only takes products with quantity > 0
        const products = await QueryGetProducts(email);
        //call the event to update the shopping list
        document.dispatchEvent(event);
        //set the home with the updated products
        await setQueryResults(products);
        await setProducts(products?.values);
      }
    }

    //set the description of the product in the alert
    const addDescription = () => {
      setMessage("Barcode: " + barcode + "<br/>" +
                 "Description: " + description);
      setIsDescription(true);
    }

  return(
    <IonCard key={idProduct}>
      <IonAlert
        isOpen={isDescription}
        onDidDismiss={() => setIsDescription(false)}
        cssClass="my-custom-class"
        header={"Detail Product"}
        message={message}
        buttons={["Ok"]}
      />
      <IonCardHeader>
        <IonRow class="ion-justify-content-between">
          <IonCol>
            <IonRow class="ion-text-wrap">
                <h5 style={{color: "black"}}> {name} </h5>
            </IonRow>
            <IonRow class="ion-text-wrap">
              <p> Quantity: {myQuantity}</p>
            </IonRow>
          </IonCol>
          {image ? 
            <IonCol size="4">
              <IonImg src={myImage} className={classes.image}/> 
            </IonCol>
          : null}
        </IonRow>
      </IonCardHeader>
      <IonCardContent>
        <IonRow class="buttons">
          <IonCol size="3">
            <IonButton size="small" onClick={decQuantity} fill="clear" disabled={myQuantity <= 0 ? true : false}> 
              <IonIcon icon={removeCircle} color="danger"/>  
            </IonButton>
          </IonCol>
          <IonCol size="3">
            <IonButton size="small" onClick={addQuantity} fill="clear">
              <IonIcon icon={addCircle} color="success"/>
            </IonButton>
          </IonCol>
          <IonCol size="3">
            <IonButton size="small" fill="clear" onClick={deleteProduct}>
              <IonIcon icon={trashBin} color="primary" />
            </IonButton>
          </IonCol>
          <IonCol size="3">
            <IonButton size="small" fill="clear" onClick={addDescription} style={{float: "right"}}>
              <IonIcon icon={informationCircle} color="secondary"/>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );

};
export default LocalCard;