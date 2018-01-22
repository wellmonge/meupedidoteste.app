import React, { Component } from 'react';
import './App.css';
import OrderScreen from "./components/orderScreen";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Meus Pedidos Teste</h1>
        </header>
        <p className="App-intro">
          Faça seu pedido.
        </p>
        <div className="App-main">
          <OrderScreen />
        </div>
      </div>
    );
  }
}

export default App;
