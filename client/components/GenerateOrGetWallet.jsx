import React from 'react';
import Submit from './Submit'

class GenerateOrGetWallet extends React.Component {
  constructor() {
    super();
    this.state = {
      action: 'generate',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      action: event.target.value
    });
  }

  render() {
      return (
        <div>
          <p className="title">Generate a new wallet or retrieve existing:</p>

          <div className="level">
            <label className="level-left">
              <input
                type="radio"
                value="generate"
                checked={this.state.action === "generate"}
                onChange={this.handleChange}
              />
              Generate
            </label>

            <label className="level-right">
              <input
                type="radio"
                value="get"
                checked={this.state.action === "get"}
                onChange={this.handleChange}
              />
              Get
            </label>
          </div>
          <Submit isGenerateWallet={this.state.action === 'generate'}/>
        </div>
      )
  }
}

export default GenerateOrGetWallet;