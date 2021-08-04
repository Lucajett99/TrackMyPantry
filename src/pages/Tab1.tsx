import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';

const Tab1: React.FC = () => {
  return(
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Products</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Products</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Products" />
        <IonButton shape="round">
          <IonIcon slot="icon-only" icon={add} />
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
