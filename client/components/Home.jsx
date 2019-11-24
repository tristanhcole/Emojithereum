import React, { Component } from 'react';
import GenerateOrGetWallet from './GenerateOrGetWallet'

export default class Home extends Component {
    render() {
       return (
         <div className='container has-text-centered'>
          <h1>Emojithereum</h1>
           <GenerateOrGetWallet/>
         </div>
       )
    }
}
