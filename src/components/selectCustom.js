import React from 'react';
import ReactDOM from 'react-dom';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';
import axios from "axios";

class SelectCustom extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            url: props.url,
            selectOptions : [],
            labelSelect: props.labelSelect,
            nameSelect: props.nameSelect,
        }
    }

    componentWillMount = () =>{
        this.getOptions();
    }

    validateExposingData = (isClientSource, data) => {
        if (isClientSource)           
            this.props.fillDefaultClients(data);
        else
            this.props.fillDefaultProducts(data);
    }

    getOptions = () => {
        const that = this;
        axios.get(this.state.url,{withCredentials: false,})
        .then(function (response) {
            if (!response && !response.data) throw "error";
            that.props.fillDefaultClients ? that.validateExposingData(true, response.data) 
                                            : that.validateExposingData(false, response.data);

            const loadOptionsArr = response.data.map((item) => {
                const unitPrice = item.hasOwnProperty("unitPrice") && item.unitPrice;
                const multiple = item.hasOwnProperty("multiple") && item.unitPrice;

                let loadOptions = { value: item._id, label: item.name };
                
                if (unitPrice) loadOptions["unitPrice"] = item.unitPrice;
                if (multiple) loadOptions["multiple"] = item.multiple;

                return loadOptions;
            });
            that.setState({selectOptions: loadOptionsArr});
        });
    }

    renderOptions = (options) =>{
        if (options && options.length === 0) return null;
        const optionsRendered = options.map((item) =>{
            return(<Option key={item.value} value={item.value} label={item.label} />)
        });

        return(
            <Select 
                name={this.state.nameSelect} 
                label={this.state.labelSelect}
                onChange={this.props.onChange.bind(this)}
            >
                {optionsRendered}
            </Select>            
        );
    }

    render() {    
        return(
            <div>
                {this.renderOptions(this.state.selectOptions)}    
            </div>            
            
        );
    };
};

export default SelectCustom;