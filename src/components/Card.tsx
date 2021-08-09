import { IonCard, IonImg, IonItemSliding, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/react';
import { star } from 'ionicons/icons';
import { createUseStyles } from 'react-jss';

interface CardProps {
  name: String;
  type: String;
  quantity: Number;
}

const useStyles = createUseStyles({
  card: {
    maxHeight: "40px",
    maxWidth: "auto",
  }
});

const Card: React.FC<CardProps> = ({ name, type, quantity}) => {
  const classes = useStyles();
  const imgURL = "data:image/jpeg;base64,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";

  const addProduct = () => {
    //save in the database
  }

  return(
      <IonCard className={classes.card}>
        <IonItem  style={{fontSize: '10px'}}>
          <IonLabel> {name} </IonLabel>
          <IonButton fill="outline" slot="end"> Add </IonButton>
        </IonItem>
        <IonCardContent>
          <IonItem style={{float: 'left'}}> {type} </IonItem>
          {/*<IonImg src={imgURL} /> */}
          <IonItem style={{float: 'right'}}> {quantity} </IonItem>
        </IonCardContent>
      </IonCard>
  );

};
export default Card;