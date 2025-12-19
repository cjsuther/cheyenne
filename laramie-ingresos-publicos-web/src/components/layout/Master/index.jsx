import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ErrorBoundary from '../../common/ErrorBoundary';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


function Master(props) {

  return (
      <div>

        <ToastContainer />

        {props.showHeader && (
        <Header />
        )}
        
        <ErrorBoundary>
          {React.createElement(props.component)}
        </ErrorBoundary>

        <Footer />
                
      </div>
  );
}

export default Master;