import { IonCard, IonImg, IonRow, IonCol, IonCardHeader, IonFab, IonCardTitle, IonFabButton, IonCardContent, IonItem, useIonLoading, IonLabel, IonButton, IonContent, IonCardSubtitle } from '@ionic/react';
import { addOutline, star } from 'ionicons/icons';
import { createUseStyles } from 'react-jss';
import { QueryCreateProduct, QueryGetProducts } from '../request/Database';
import { postVotes } from '../request/API';

interface CardProps {
  barcode: String;
  id: String;
  sessionToken: String;
  name: String;
  description: String;
  image: any;
  setQueryResult: any;
  closeModal: any;
}

const useStyles = createUseStyles({
  card: {
    maxHeight: "auto",
    minHeight: "auto",
    maxWidth: "auto",
  },
  image: {
    height: "100px",
    width: "100%",
    marginTop: "10px"
  }
});

const Card: React.FC<CardProps> = ({ barcode, id, sessionToken, name, description, image, setQueryResult, closeModal}) => {
  const [show, dismiss] = useIonLoading();
  const classes = useStyles();
  
  const addProduct = async () => {
    const productData = {
      id: id,
      barcode: barcode,
      name: name,
      description: description,
      image: image
    };

    show("Loading");
    await QueryCreateProduct(productData);
    const response = await postVotes(sessionToken, 1, id);
    setQueryResult(await QueryGetProducts());
    dismiss();
    if(response?.ok)
      closeModal();
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
                <IonButton fill="outline" size="small" onClick={addProduct} style={{float: "right"}}> Add </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonCol>
  </IonRow>
  );

};
export default Card;
