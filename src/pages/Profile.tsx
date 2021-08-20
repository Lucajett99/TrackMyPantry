import { IonAvatar, IonCol, IonGrid, IonImg, IonIcon, IonItem, IonPage, IonRow, IonText, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonLabel } from "@ionic/react";
import { useEffect, useState } from "react";
import { personCircle } from "ionicons/icons";
import { useHistory } from "react-router";
import { getUser } from "../request/API";
import { getValue, removeKey, setValue, takePicture } from "../request/utility";

const Profile: React.FC = () => {
    const [email, setEmail] = useState<String>("");
    const [username, setUsername] = useState<String>("");
    const [image, setImage] = useState<any>(null);
    const history = useHistory();

    const getUserDetail = async () => {
        const myEmail = await getValue("email");
        const myUsername = await getValue("username");
        const myImage = await getValue("photoAccount");
        if(myEmail && myUsername) {
            setEmail(myEmail);
            setUsername(myUsername);
            setImage(myImage);
        }
        else {
            const response = await getUser();
            if(response?.ok){
                const user = await response.json();
                setEmail(user.email);
                setUsername(user.username);
            }
        }
    }

    const handleLogout = async () => {
        await removeKey("accessToken");
        await removeKey("date");
        history.push('/login')
    }

    const handlePhoto = async () => {
        const photo = await takePicture();
        if(photo) {
            setValue("photoAccount", photo)
            setImage(photo);
        }
    }

    useEffect(() => {
        getUserDetail();
    }, [])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="ion-text-center"> Profile </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding ion-text-center">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonAvatar style={{margin: 'auto'}}>
                                {!image ? <IonIcon
                                    style={{ fontSize: "70px", color: "black" }}
                                    icon={personCircle}
                                /> : <IonImg src={"data:image/jpeg;base64," + image}/>}
                            </IonAvatar>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton buttonType="string" onClick={handlePhoto} style={{fontSize: "8px", float: "left"}}> Take a photo </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton buttonType="string" onClick={() => setImage(null)} style={{fontSize: "8px", float: "right"}}> Remove photo </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonItem style={{fontSize: '15px', width: "100%"}}>
                            <IonCol>
                                <IonLabel> Email: </IonLabel>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <p> {email} </p>
                                </IonText>
                            </IonCol>
                        </IonItem>
                    </IonRow>
                    <IonRow>
                        <IonItem style={{fontSize: '15px', width: "100%"}}>
                            <IonCol>
                                <IonLabel> Username: </IonLabel>
                            </IonCol>
                            <IonCol>
                                <IonText>
                                    <p> {username} </p>
                                </IonText>
                            </IonCol>
                        </IonItem>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={handleLogout} color="dark"> Logout </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};
export default Profile;