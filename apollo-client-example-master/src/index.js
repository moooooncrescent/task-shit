import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import * as serviceWorker from "./serviceWorker";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createGlobalStyle } from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

ReactDOM.render(
  <>
    <ApolloProvider client={client}>
      <App />
      <GlobalStyle />
    </ApolloProvider>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
