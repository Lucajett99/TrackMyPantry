import { IonApp, IonRouterOutlet } from '@ionic/react';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { getDate, getToken } from './request/utility';

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
      const token = await getToken();
      const date = new Date(await getDate());
      const today = new Date();
      date.setDate(date.getDate() + 7);
      if(token != null && date.getTime() > today.getTime())
        setPath('/home');
      else
        setPath('/login');
    })();
  }, [])

  return(
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route path="/registration" component={Registration} />
          <Route path="/home" component={Home} />
          <Redirect exact from="/" to={path} />
        </IonRouterOutlet>
      </IonReactRouter>  
    </IonApp> 
  );
}

export default App;
