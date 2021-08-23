import { IonCard, IonImg, IonRow, IonCol, IonCardHeader, IonFab, IonCardTitle, IonFabButton, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonContent, IonCardSubtitle, IonInput } from '@ionic/react';
import { addCircle, removeCircle, trashBin } from 'ionicons/icons';
import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { QueryDeleteProduct, QueryGetProducts, QueryAdd_DecQuantity } from '../request/Database';

interface CardProps {
    barcode: String;
    id: String;
    name: String;
    description: String;
    image: any;
    quantity: Number;
    setProducts: any;
}

const useStyles = createUseStyles({
  card: {
    maxHeight: "auto",
    minHeight: "auto",
    maxWidth: "auto",
  },
  image: {
    height: "100px",
    width: "100%"
  }
});

const LocalCard: React.FC<CardProps> = ({ barcode, id, name, description, image, quantity, setProducts}) => {
    const [myQuantity, setMyQuantity] = useState<any>(quantity);
    const classes = useStyles();
  
    const deleteProduct = async () => {
        const response = await QueryDeleteProduct(id);
        setProducts(await QueryGetProducts());
    }

    const addQuantity = async () => {
      await setMyQuantity(myQuantity + 1);
      await QueryAdd_DecQuantity(id, myQuantity);
    }

    const decQuantity = async () => {
      await setMyQuantity(myQuantity - 1);
      await QueryAdd_DecQuantity(id, myQuantity);
    }

  /*
  {
    name: name,
    barcode: barcode,
    description: description,
    image: image,
    quantity: quantity,
    expiration: expiration
  }
  */

  return(
    <IonRow>
      <IonCol>
        <IonCard>
          {image ? <IonImg src={"data:image/jpeg;base64," + image} className={classes.image}/> : null}
          <IonCardHeader>
            <IonCardTitle>{name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol>
                <IonItem style={{float: 'left', fontSize: '14px'}}> {description} </IonItem> 
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton size="small" onClick={decQuantity}>
                  <IonIcon icon={removeCircle}/>  
                </IonButton>
              </IonCol>
              <IonCol>
                <IonItem style={{float: 'left', fontSize: '14px'}}> {myQuantity} </IonItem>
              </IonCol>
              <IonCol>
                <IonButton size="small" onClick={addQuantity}>
                  <IonIcon icon={addCircle}/>
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={deleteProduct} style={{float: "right"}}>
                    <IonIcon icon={trashBin}/>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonCol>
  </IonRow>
  );

};
export default LocalCard;
