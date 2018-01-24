import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'muicss/lib/react/container';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';

const OrderGrid = (props) => {
 
    const renderRows = (data) => {
        if (!data || data.leght == 0) return;
        const rows = data.map((item) => {
            return (<Row>
                        <Col md="4">{item.product.name}</Col>
                        <Col md="4">{item.unitPrice}</Col>
                        <Col md="2">{item.quantity}</Col>
                        <Col md="2">{item.totalByProduct}</Col>
                    </Row>)  
            });
        return rows;
    }

    return (    
        <Container fluid={true}>
            <Row>
                <Col md="4">Produto</Col>
                <Col md="4">Preço Unitário</Col>
                <Col md="2">Qtd</Col>
                <Col md="2">Total</Col>
            </Row>        
            {renderRows(props.data)}
        </Container>
    );    
}
 

export default OrderGrid;