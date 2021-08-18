import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonTabs, IonLabel, IonContent } from '@ionic/react';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { homeOutline, personOutline } from 'ionicons/icons';
import { getValue } from './request/utility';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';



const App: React.FC = () => {
  const [path, setPath] = useState<any>('');

  useEffect(() => {
    (async () => {
      const token = await getValue("accessToken");
      const date = new Date(await getValue("date"));
      const today = new Date();
      date.setDate(date.getDate() + 7);
      if(token != null && date.getTime() > today.getTime())
        setPath('/home');
      else
        setPath('/login');
    })();
  }, []);


  return(
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/">
              <Redirect to={path} />
            </Route>
            <Route exact path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel> Home </IonLabel>
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={personOutline} />
              <IonLabel> Profile </IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>  
    </IonApp> 
  );
}

export default App;