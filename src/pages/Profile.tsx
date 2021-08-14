import { IonAvatar, IonCol, IonGrid, IonImg, IonItem, IonPage, IonRow, IonText } from "@ionic/react";

const Profile: React.FC = () => {
    return (
        <IonPage>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonAvatar>
                            <IonImg src="https://i.pinimg.com/originals/68/1a/35/681a3525e486a4800641b627e53efd34.png"/>
                        </IonAvatar>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonAvatar>
                            <IonText />
                        </IonAvatar>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
};
export default Profile;