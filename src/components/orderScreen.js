import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';

import SelectCustom from './selectCustom';

class OrderScreen extends React.Component {
  
  
  constructor(props) {
      super(props);
      this.state ={
        selectedProduct : null,
        total: 0,
        quantity: 0,
        unitPrice: 0    
      }
  }  

  fillDefaultClients = (data) => {
    this.setState({clients: data});     
  }

  fillDefaultProducts = (data) => {
    this.setState({products: data});
  }
  
  filterItem = (id, list) => {
      debugger
    return list.filter((item) => {
        return item._id === id;
    });
  }

  onChangeClient = (ev) => {
    const _id = ev.target.value;
    const selectedClient = this.filterItem(_id, this.state.clients);
    this.setState({selectedClient : selectedClient[0] });
  }

  onChangeProduct = (ev) => {
    const _id = ev.target.value;
    const selectedProduct = this.filterItem(_id, this.state.products);
    this.setState({selectedProduct : selectedProduct[0], unitPrice:  selectedProduct[0].unitPrice });
  }

  onChangeValue = (ev) => {
    const value = ev.target.value;
    const total = this.state.unitPrice * value;
    this.setState({total: total, quantity: value});
}

  render() {
    return (
        <Form>
            <SelectCustom 
                onChange={this.onChangeClient}
                fillDefaultClients={this.fillDefaultClients}
                url={`${HOST}/client/findall`} 
                labelSelect={"Selecione o Cliente"} 
                nameSelect={"client"} 
            />
            <SelectCustom 
                onChange={this.onChangeProduct}
                fillDefaultProducts={this.fillDefaultProducts} 
                url={`${HOST}/product/findall`} 
                labelSelect={"Selecione o Produto"} 
                nameSelect={"product"} 
            />            
            <Input 
                name="quantity" 
                placeholder="Quantidade/Unidades"
                value={this.state.quantity}
                onChange={this.onChangeValue.bind(this)}
            />
            <Input 
                name="unitPrice" 
                placeholder="Preço Unitário" 
                floatingLabel={true} 
                value={this.state.unitPrice}/>
        
        <Button variant="raised">Enviar Pedido</Button>
        <Panel style={{ float : "right" }}>
            {this.state.total}
        </Panel>
      </Form>
    );
  }
}

export default OrderScreen;