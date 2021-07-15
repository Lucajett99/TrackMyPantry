import { IonRow, IonItem, IonButton, IonLabel, IonInput, IonCol, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { login } from '../request/API';


const baseURL = 'https://lam21.modron.network/auth/login'

const Login: React.FC = () => {

  const handleLogin = () => {
    const email = document.getElementById("email")?.nodeValue;
    const password = document.getElementById("password")?.nodeValue;
    login(email, password);
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
          <IonButton expand="block" onClick={handleLogin}>
            Login
          </IonButton>
          <p style={{ fontSize: "12px" }}>
            Don't have an account? <a href="#">Sign up!</a>
          </p>
        </IonCol>
      </IonRow>
    </IonPage>
  );
};

export default Login;