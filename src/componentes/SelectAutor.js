import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class SelectAutor extends Component{

    constructor(){
        super();
        this.state = {msgErro:''};
    }

    render() {
        return (
            <div className="pure-control-group">
              <label htmlFor={this.props.id}>{this.props.label}</label>
              <select value={this.props.value} name={this.props.name} id={this.props.id} onChange={this.props.onChange}>
                <option>Selecione o Autor</option>
                {
                  this.props.lista.map(function(autor){
                    return(
                      <option key={autor.id} value={autor.id}>{autor.nome}</option>
                    );
                  })
                }
              </select>
              <span className="error">{this.state.msgErro}</span>
            </div>
        );
    }

    componentDidMount() {
        PubSub.subscribe("erro-validacao",function(topico,erro){
            if(erro.field === this.props.name){
                this.setState({msgErro:erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe("limpa-erros",function(topico){
            this.setState({msgErro:''});
        }.bind(this));
    }
}
