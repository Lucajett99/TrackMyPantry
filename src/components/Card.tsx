import { IonCard, IonImg, IonRange, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonContent, IonAlert, IonIcon, IonModal } from '@ionic/react';
import { productData } from '../utils/utility';
import { createUseStyles } from 'react-jss';
import { QueryCheckProductsByPK, QueryCreateProduct, QueryGetProducts, QueryUpdateProduct } from '../utils/Database';
import { postVotes } from '../utils/API';
import { useState } from 'react';
import { getValue } from '../utils/utility';
import { informationCircleOutline, star, starOutline} from 'ionicons/icons';

interface CardProps {
  barcode: string;
  id: string;
  sessionToken: string;
  name: string;
  description: string;
  image: any;
  setProducts: any;
  setQueryResults: any;
  closeModal: any;
}

const useStyles = createUseStyles({
  card: {
    maxHeight: "auto",
    minHeight: "auto",
    maxWidth: "auto",
  },
  description: {
    maxHeight: "30px",
    float: "left",
    fontSize: "14px"
  },
  image: {
    height: "100px",
    width: "100%",
    marginTop: "10px"
  }
});

const Card: React.FC<CardProps> = ({ barcode, id, sessionToken, name, description, image, setProducts, setQueryResults, closeModal}) => {
  const [iserror, setIserror] = useState<boolean>(false);
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [rating, setRating] = useState<boolean>(false);
  const [vote, setVote] = useState<number>(1);
  const [message, setMessage] = useState<string>("");
  const classes = useStyles();
  const myImage: string = image?.includes("data:image/jpeg;base64,") ? image : "data:image/jpeg;base64," + image;

  //adds the new product to the local database
  const addProduct = async () => {
    const email = await getValue("email");
    const values = await QueryCheckProductsByPK(id, email);
    const event = new Event('trigger');
    
    if(values?.length) {
      //if it is already present and has quantity = 0 then it simply has to do an update query and update the quantity to 1
      if(values[0].quantity == 0) {
        await QueryUpdateProduct(email, id);
        const products = await QueryGetProducts(email);
        //update the products in the home
        await setQueryResults(products);
        await setProducts(products?.values);
        //call the event that will update the shopping list
        document.dispatchEvent(event);
        closeModal();
      }
      else {
        setMessage("This product is already in the pantry");
        setIserror(true);
      }
    }
    else {
      //obviously if it is not present it will first ask for the rating and then add it to the pantry
      setRating(true);
    }
  }

  //is called after voting for the product, closes the modal and updates the home
  const handleClose = async () => {
    const email = await getValue("email");
    const data: productData = { id, barcode, name, description, image, email };

    setRating(false);
    //call the function that makes the http call to rate the product
    const response = await postVotes(sessionToken, vote, id);
    //query that creates the product in the local database
    await QueryCreateProduct(data);
    //query that returns all products with quantity> 0
    const products = await QueryGetProducts(email);
    //update the products in the home
    await setQueryResults(products);
    await setProducts(products?.values);
    closeModal();
  }

  //adds the product description to the window
  const addDescription = () => {
    setMessage(description);
    setIsDescription(true);
  }

  return(
    <IonCard>
      <IonAlert
        isOpen={iserror}
        onDidDismiss={() => setIserror(false)}
        cssClass="my-custom-class"
        header={"Error!"}
        message={message}
        buttons={["Dismiss"]}
      />
      <IonAlert
        isOpen={isDescription}
        onDidDismiss={() => setIsDescription(false)}
        cssClass="my-custom-class"
        header={"Description:"}
        message={message}
        buttons={["Ok"]}
      />

      <IonModal isOpen={rating} cssClass='my-custom-class'>
        <IonContent fullscreen className="ion-padding ion-text-center" >
          <h3> Rate it: </h3>
          <IonRange min={1} max={5} step={1} pin snaps ticks color="primary" onIonChange={(e: any) => setVote(e.detail.value!)} style={{marginTop: "40%"}}>
            <IonIcon slot="start" size="small" color="primary" icon={starOutline}/>
            <IonIcon slot="end" size="small" color="primary" icon={star}/>
          </IonRange>
          <IonButton onClick={handleClose} color="dark"> SEND </IonButton>
        </IonContent>
      </IonModal>

      {image ? <IonImg src={myImage} className={classes.image}/> : null}
      <IonCardHeader>
        <IonCardTitle>{name}</IonCardTitle> 
      </IonCardHeader>
      <IonCardContent>
        <IonRow>
          <IonCol>
            <IonButton fill="clear" size="default" color="dark" style={{float: "left"}} onClick={addDescription}>
              <IonIcon icon={informationCircleOutline}/>
            </IonButton>
          </IonCol>        
          <IonCol>
            <IonButton size="small" onClick={addProduct} style={{float: "right"}} color="dark"> Add </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );

};
export default Card;
