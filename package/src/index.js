import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import App from "./App";
import { store } from './redux/Store';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Spinner from "./views/Spinner/Spinner";

const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense fallback={<Spinner />}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Suspense>
      </PersistGate>
    </Provider>,
  </React.StrictMode>
);

reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
