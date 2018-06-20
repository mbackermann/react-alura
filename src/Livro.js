import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import SelectAutor from './componentes/SelectAutor';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from  './TratadorErros';

class FormularioLivro extends Component {

  constructor(){
    super();
    this.state = {titulo: '', preco: '', autorId: '', autores: []};
    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(event){
    event.preventDefault();
    $.ajax({
      url: "http://localhost:8080/api/livros",
      contentType: "application/json",
      dataType: "json",
      type: "post",
      data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
      success: function(novaListagem){
        PubSub.publish('atualiza-lista-livros',novaListagem);
        this.setState({titulo:'',preco:'', autorId:''});
      }.bind(this),
      error: function(resposta){
        if(resposta.status === 400) {
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish('limpa-erros',{});
      }
    })
  }

  salvaAlteracao(nomeInput,evento){
    var campoSendoAlterado = {};
    campoSendoAlterado[nomeInput] = evento.target.value;
    this.setState(campoSendoAlterado);
  }

  render(){
    return(
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
          <InputCustomizado id="titulo" name="titulo" type="text" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this,'titulo')} label="Título"/>
          <InputCustomizado id="preco" min="0.00" step="0.01" name="preco" type="number" value={this.state.preco} onChange={this.salvaAlteracao.bind(this,'preco')} label="Preço"/>
          <SelectAutor id="autorId" name="autorId" value={this.state.autorId} onChange={this.salvaAlteracao.bind(this,'autorId')} label="Autor" lista={this.props.autores} />
          <BotaoSubmitCustomizado label="Gravar" />
        </form>

      </div>
    )
  }

}

class TabelaLivros extends Component {
  render(){
    return(
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Preço</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(livro){
                return (
                  <tr key={livro.id}>
                    <td>{livro.titulo}</td>
                    <td>{livro.preco}</td>
                    <td>{livro.autor.nome}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default class LivroBox extends Component {

  constructor(){
    super();
    this.state = {lista: [], autores: []}
  }

  componentDidMount(){
    $.ajax({
      url: 'http://localhost:8080/api/livros',
      dataType: 'json',
      success: function(data){
        this.setState({lista: data})
      }.bind(this)
    })

    $.ajax({
      url: 'http://localhost:8080/api/autores',
      dataType: 'json',
      success: function(data){
        this.setState({autores: data})
      }.bind(this)
    })

    PubSub.subscribe("atualiza-lista-livros",function(topico, novaLista){
      this.setState({lista: novaLista});
    }.bind(this));
  }

  render(){
    return(
      <div>
        <div className="header">
          <h1>Cadastro de Livros</h1>
        </div>
        <div className="content" id="content">
          <FormularioLivro autores={this.state.autores}/>
          <TabelaLivros lista={this.state.lista}/>
        </div>
      </div>
    )
  }
}
