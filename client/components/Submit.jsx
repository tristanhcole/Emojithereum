const runes = require('runes');

import React from 'react';
import { emojiUnicode, generateQueryString, handleResponse } from "../utils";

class Submit extends React.Component {
  constructor() {
    super();
    this.state = {
      privateKey: null,
      nameResult: null,
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if (this.props.isGenerateWallet) {
      this.generateWalletFromName()
    } else {
      this.getNameFromPrivateKey()
    }

    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  generateWalletFromName() {
      return fetch('/generate/', {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({name:this.state.value})
      })
      .then(response => {
        return handleResponse(response);
      })
      .then(handled =>{
        this.setState({
          privateKey: handled.privateKey,
          nameResult: null,
        })
      })
      .catch(error => {
          throw error;
      })
  }

  getNameFromPrivateKey() {
    let emojiList = runes(this.state.value);
    // let unicodeList = emojiList.map(emoji => emojiUnicode(emoji));
      return fetch('/name/' + generateQueryString(emojiList), {
          headers: {
              // 'Authorization': getToken()
          },
          method: 'GET'
      })
      .then(response => {
        return handleResponse(response);
      })
      .then(handled =>{
        this.setState({
          privateKey: null,
          nameResult: handled.nameResult,
        })
      })
      .catch(error => {
          throw error;
      })
  }

  render() {
    let { isGenerateWallet } = this.props;
    let { privateKey, nameResult } = this.state;

    if (privateKey) {
      console.log(runes(privateKey))
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            {isGenerateWallet ? 'Name' : 'Private Key'}
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <div><p>{privateKey}</p></div>
        <div><p>{nameResult}</p></div>
      </div>
    )
  }
}

export default Submit;