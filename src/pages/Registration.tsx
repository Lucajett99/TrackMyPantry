import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import { register } from '../utils/API';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
import { useHistory } from 'react-router';

//is used to see if the email is actually an email
function validateEmail(email: string) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

const Registration: React.FC = () => {
    const [username, setUsername] = useState<string>("Mario72");
    const [email, setEmail] = useState<string>("mariorossi@hotmail.it");
    const [password, setPassword] = useState<string>("Ciao1234");
    const [iserror, setIserror] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [presentToast, dismissToast] = useIonToast();
    const history = useHistory();

    //does all the checks and makes the http call to register
    const handleRegistration = async () => {
        if (!username) {
            setMessage("Please enter a valid username");
            setIserror(true);
            return;
        }
        if (!email) {
            setMessage("Please enter a valid email");
            setIserror(true);
            return;
        }
        if (validateEmail(email) === false) {
            setMessage("Your email is invalid");
            setIserror(true);
            return;
        }

        if (!password || password.length < 6) {
            setMessage("Please enter your password");
            setIserror(true);
            return;
        }
        //calls the function that makes the http call
        const response = await register(username, email, password);
        if(response.ok) {
            presentToast({message: "Registration successful", duration: 1500, color: "success"});
            //if successful, the login display is shown
            history.push('/login');
        }
        else {
            if(response.status == 500) {
                setMessage("Status code: " + response.status.toString() +"<br/><br/> The email has probably already been used" );
                setIserror(true);
            }
            else {
                setMessage("Status code: " + response.status.toString());
                setIserror(true);
            }
        }
    };

    return (
        <IonPage>
        <IonHeader>
            <IonToolbar>
            <IonTitle class="ion-text-center">Registration</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding ion-text-center">
            <IonGrid>
            <IonRow>
            <IonCol>
                <IonAlert
                    isOpen={iserror}
                    onDidDismiss={() => setIserror(false)}
                    cssClass="my-custom-class"
                    header={"Error!"}
                    message={message}
                    buttons={["Dismiss"]}
                />
            </IonCol>
            </IonRow>
            <IonRow>
            <IonCol>
                <IonIcon
                    style={{ fontSize: "70px", color: "black" }}
                    icon={personCircle}
                />
            </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position="floating"> Username</IonLabel>
                        <IonInput
                            type="text"
                            value={username}
                            onIonChange={(e) => setUsername(e.detail.value!)}
                        >
                        </IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position="floating"> Email</IonLabel>
                        <IonInput
                            type="email"
                            value={email}
                            onIonChange={(e) => setEmail(e.detail.value!)}
                        >
                        </IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol>
                    <IonItem>
                        <IonLabel position="floating"> Password</IonLabel>
                        <IonInput
                            type="password"
                            value={password}
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        >
                        </IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                <IonButton expand="block" color="dark" onClick={handleRegistration}>Register</IonButton>
                <p style={{ fontSize: "small" }}>
                    Do you already have an account?? <a href="/login">Sign in!</a>
                </p>

                </IonCol>
            </IonRow>
            </IonGrid>
        </IonContent>
        </IonPage>
    );
};

export default Registration;
