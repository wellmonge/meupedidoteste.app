import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import CurrencyInput from "react-currency-input";
import Divider from 'muicss/lib/react/divider';
import Container from 'muicss/lib/react/container';
import axios from "axios";
import SelectCustom from './selectCustom';
import OrderGrid from './orderGrid';
import styles from "./styles";

const HOST = 'https://meupedidotesteapi.herokuapp.com';

// const HOST = 'http://localhost:3000';
class OrderScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state ={
        selectedProduct : null,
        selectedClient : null,
        total: 0,
        quantity: "",
        unitPrice: 0,
        productToOrders: [],

      }
  }  
  
  calcprofitability = (unitPriceSugest, incoming) => {
    const profit = (parseFloat(incoming) - parseFloat(unitPriceSugest)) / parseFloat(unitPriceSugest) * 100;
    if (profit >= 0) {
      return { profit, msg: "Rentabilidade ótima;", flag: 3 }
    }else if (profit < 0 && profit >= -10) {
      return  { profit, msg: "Rentabilidade boa;", flag: 2 }
    } else {
      return  { profit, msg: "Rentabilidade ruim;", flag: 1 }
    }
  }

  fillDefaultClients = (data) => {
    this.setState({ selectedClient : data[0], clients: data});     
  }

  fillDefaultProducts = (data) => {
    this.setState({ selectedProduct : data[0], products: data,unitPrice:  data[0].unitPrice, multiple: data[0].multiple });
  }
  
  filterItem = (id, list) => {
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
    this.setState({ selectedProduct : selectedProduct[0], unitPrice:  selectedProduct[0].unitPrice, multiple: selectedProduct[0].multiple });
  }

  onChangeQuantity = (ev) => {
    const value = ev.target.value;
    const multiple = this.state.multiple ? this.state.multiple : 0; 
    const total = this.state.unitPrice * value;
    if (multiple !== 0 && value % multiple !== 0) return alert(`A quantidade ${value} não é multiplo de ${multiple}.`)
    this.setState({total: total, quantity: value});
  }

  onChangeUnityPrice = (event, mask, floatvalue) => {
    const value = event.target.value;
    const selectedProduct = this.filterItem(this.state.selectedProduct._id, this.state.products);
    const unitPriceDefault = selectedProduct[0].unitPrice;
    const total = this.state.quantity * value;
    const profit = this.calcprofitability(unitPriceDefault, value);
    
    this.setState({total: total, unitPrice: value, profit: profit});
  }

  addProduct = () => {
    if (this.state.selectedProduct) {
      const productsToOrders = {
        product: this.state.selectedProduct,
        unitPrice: this.state.unitPrice,
        quantity: this.state.quantity,
        totalByProduct: this.state.unitPrice * this.state.quantity,
      }

      this.state.productToOrders.push(productsToOrders);
      this.setState({ productToOrders: this.state.productToOrders});
    }
  }

  sendOrder = () => {
    const that = this
    if (this.state.productToOrders.length == 0) return;
    
    const totalByOrder = that.state.productToOrders.map((item) => {
      return item.totalByProduct;
    }).reduce((prev,next) => {
          return prev + next;
        })

    const order = {
        productToOrders:  that.state.productToOrders,
        client: that.state.selectedClient ,
        totalByOrder: totalByOrder,
      };
      
    axios.post(`${HOST}/order/create`,order)
      .then((response) => {
         that.setState({ productToOrders : this.state.productToOrders }),
         alert()
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const styleCurrency = this.state.profit && (this.state.profit.flag === 1 ? styles.redS : this.state.profit.flag == 2 ? styles .yellowS : styles.greenS);
    return (
      <Container>
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
                onChange={this.onChangeQuantity}
            />

            <div className="mui-textfield">
             <Input
                required={true}
                name="unitPrice" 
                placeholder="Preço Unitário" 
                value={this.state.unitPrice}
                onChange={this.onChangeUnityPrice} 
              />
            </div>            
        <div>
        
        <input type='button' onClick={this.addProduct.bind(this)} value='Adicionar Produto' />
        <input type='button' onClick={this.sendOrder.bind(this)} value='Enviar Pedido' />
        </div>
        <Divider />
        <div className="mui-container">
        <label>TOTAL</label>
           <CurrencyInput 
           style={styleCurrency} 
           prefix="R$ " 
           className="currecyInput" 
           ref="total" 
           value={this.state.total} />
        </div>
      </Form>
      <OrderGrid data={this.state.productToOrders}/>
    </Container>
    );
  }
} 

export default OrderScreen;