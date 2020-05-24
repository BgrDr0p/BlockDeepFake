import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Video from '../abis/Video.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount()
  {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }


  constructor(props) {
    super(props)

    this.state = {
      buffer: null,
      videoHash : '',
      account: null,
      contract: null

    }
  }


  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState( { account: accounts[0] })
    console.log(accounts)
    const networkId = await web3.eth.getId()
    console.log(networkId)
    const networkData = Video.networks[networkId]
    if (networkData)
    {
      const abi = Video.abi
      const address = networkData.address
      // fetch network
      
      const contract = web3.eth.Contract(abi, address)
      this.setState( {contract  })
      console.log('ici',contract)
      const videoHash = await contract.methods.get().call()
      this.setState( { videoHash})

    }
    else
    {
      window.alert('Non-Ethereum browser detected')
    }
   
  }


  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }



  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }



  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    
    ipfs.add(this.state.buffer, (error, result) => 
    {
      console.log('Ipfs result', result)
      const videoHash = result[0].hash
     
      
      if(error)
      {
        console.error(error)
        return
      }
      this.state.contract.methods.set(videoHash).send( { from: this.state.account }).then((r) =>{
        this.setState({ videoHash})

      })
    })
    
  }



  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://github.com/ElHassanBaghrar/BlockDeepfake"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
            Upload Video on IPFS and Blockchain
          
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white" > {this.state.account}   </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/ElHassanBaghrar/BlockDeepfake"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <video width="320" height="240" controls src={`https://ipfs.infura.io/ipfs/${this.state.videoHash}`}>Ici la description alternative</video>
                 
                </a>
                <h1>Upload Video on IPFS and Blockcchain</h1>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit'  />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
