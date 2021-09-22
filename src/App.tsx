import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonTabs, IonLabel, IonContent, IonRoute } from '@ionic/react';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import ShoppingList from './pages/ShoppingList';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { homeOutline, listOutline, logOutOutline } from 'ionicons/icons';
import { isAuthed, removeKey } from './utils/utility';

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
import { closeConnection } from './utils/Database';

const App: React.FC = () => {
  const [path, setPath] = useState<any>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const history = useHistory();

  const handleLogout = async () => {
    await removeKey("accessToken");
    await removeKey("date");
    //history.push('/login')
    await closeConnection();
    window.location.assign('/login')
  }

  const tabClicked = async (e: any) => {
    if(e.detail.tab == 'logout')
      await handleLogout();
  }

  useEffect(() => {
    (async () => {
      const response = await isAuthed();
      setDisabled(!response);
      setPath(response ? '/home' : '/login')
    })();
  }, []);


  return(
    <IonApp>
      <IonReactRouter>
        <IonTabs onIonTabsDidChange={tabClicked}>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/shoppingList">
              <ShoppingList />
            </Route>
            <Route exact path="/">
              <Redirect to={path} />
            </Route>
            <Route exact path="/login" render={() => { return <Login setDisabled={setDisabled}/>}} />
            <Route path="/registration" component={Registration} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom" color="dark">
            <IonTabButton tab="home" href="/home" disabled={disabled}>
              <IonIcon icon={homeOutline} />
              <IonLabel> Home </IonLabel>
            </IonTabButton>
            <IonTabButton tab="shoppingList" href="/shoppingList" disabled={disabled}>
              <IonIcon icon={listOutline} />
              <IonLabel> Shopping List </IonLabel>
            </IonTabButton>
            <IonTabButton tab="logout" disabled={disabled}>
              <IonIcon icon={logOutOutline} />
              <IonLabel> Logout </IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>  
    </IonApp> 
  );
}

export default App;