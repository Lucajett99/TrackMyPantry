import { IonRow, IonItem, IonButton, IonLabel, IonInput, IonCol, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { register } from '../request/API';
import { IonToast } from '@ionic/react';
import { useState } from 'react';

const Login: React.FC = () => {
    const [showToast1, setShowToast1] = useState(false);

    const handleSignUp = async () => {
        const username = (document.getElementById("username") as HTMLInputElement).value;
        const email = (document.getElementById("email") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const response = await register(username, email, password);
        if(response.ok) {
            setShowToast1(true);
            const data = await response.json();
            console.log(data);
        }
    }; 

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign up</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonRow>
                <IonCol>
                    <IonIcon
                        style={{ fontSize: "70px", color: "#0040ff", marginLeft: "35%", marginRight: "35%" }}
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
                            id="username"
                            //onIonChange={(e) => setEmail(e.detail.value!)}
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
                            id="email"
                            //onIonChange={(e) => setEmail(e.detail.value!)}
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
                            id="password"
                            //onIonChange={(e) => setPassword(e.detail.value!)}
                        >
                        </IonInput>
                    </IonItem>
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol>
                <p style={{ fontSize: "10px" }}>
                    By clicking REGISTER you agree to our <a href="#">Policy</a>
                </p>
                <IonButton expand="block" onClick={ handleSignUp } >
                    Register
                </IonButton>
                <p style={{ fontSize: "12px" }}>
                    Do you already have an account? <a href="/login">Sign in!</a>
                </p>
                </IonCol>
                <IonToast
                isOpen={showToast1}
                onDidDismiss={() => setShowToast1(false)}
                message="Sign up success!"
                duration={500}
                />
            </IonRow>
        </IonPage>
    );
};

export default Login;