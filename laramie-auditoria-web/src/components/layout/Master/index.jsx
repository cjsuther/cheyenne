import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ErrorBoundary from '../../common/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import { useManagedContext } from '../../hooks';

import 'react-toastify/dist/ReactToastify.css';


function Master(props) {
  const { isTempView } = useManagedContext()

  return (
      <div>

        <ToastContainer />

        {props.showHeader && !isTempView && (
          <Header />
        )}
        
        <ErrorBoundary>
          {React.createElement(props.component, props.properties)}
        </ErrorBoundary>

        <Footer />
                
      </div>
  );
}

export default Master;