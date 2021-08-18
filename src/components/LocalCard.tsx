import { IonCard, IonImg, IonRow, IonCol, IonCardHeader, IonFab, IonCardTitle, IonFabButton, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonContent, IonCardSubtitle } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import { createUseStyles } from 'react-jss';
import { QueryDeleteProduct, QueryGetProducts } from '../request/Database';

interface CardProps {
    barcode: String;
    id: String;
    name: String;
    description: String;
    image: any;
    quantity: Number;
    setQueryResult: any;
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

const LocalCard: React.FC<CardProps> = ({ barcode, id, name, description, image, quantity, setQueryResult}) => {
    const classes = useStyles();
  
    const deleteProduct = async () => {
        const response = await QueryDeleteProduct(id);
        setQueryResult(await QueryGetProducts());
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
                <IonItem style={{float: 'left', fontSize: '14px'}}> {quantity} </IonItem> 
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
