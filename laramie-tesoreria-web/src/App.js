import React, {useEffect} from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './context/redux/store/configureStore';
import Router from './Router';
import moment from 'moment';
import { ContextManager } from './context/custom/ManagedContext';


function App({ basename }) {

  useEffect(() => {
		moment.locale('es');
	}, []);

  const { store, persistor } = configureStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <ContextManager>

          <BrowserRouter basename={basename}>
            <Router basename={basename} />
          </BrowserRouter>

        </ContextManager>

      </PersistGate>
    </Provider>
  );
}

export default App;
