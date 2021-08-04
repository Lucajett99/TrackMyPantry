import { IonRow, IonItem, IonButton, IonLabel, IonInput, IonCol, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { login } from '../request/API';
import { IonToast } from '@ionic/react';
import { useState } from 'react';

const Login: React.FC = () => {
  const [showToast1, setShowToast1] = useState(false);

  const handleSingIn = async () => {
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement ).value;
    const response = await login(email, password);
    if(response.ok)
      setShowToast1(true);
    const data = await response.json();
    console.log(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
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
            By clicking LOGIN you agree to our <a href="#">Policy</a>
          </p>
          <IonButton expand="block" onClick={handleSingIn} >
            Login
          </IonButton>
          <p style={{ fontSize: "12px" }}>
            Don't have an account? <IonRouterLink href="#">Sign Up</IonRouterLink>
          </p>
        </IonCol>
        <IonToast
          isOpen={showToast1}
          onDidDismiss={() => setShowToast1(false)}
          message="Sign in success!"
          duration={500}
        />
      </IonRow>
    </IonPage>
  );
};

export default Login;