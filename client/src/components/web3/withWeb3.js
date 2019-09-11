import React, { PureComponent } from 'react';
import waitForWeb3 from './waitForWeb3';
import Auction from '../../../../build/contracts/Auction.json';

const injectWeb3 = InnerComponent =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        web3: null,
        contract: null,
        loading: true,
        accounts: null
      };
      this.getWeb3 = this.getWeb3.bind(this);
      this.smart = '0x4DAA2327b41517099ac40368029567e3b23539FA';
    }

    componentDidMount() {
      window.ethereum.enable();
      this.getWeb3().then(() => this.setState({ loading: false }));
    }

    async getWeb3() {
      try {
        const web3 = await waitForWeb3();
        const contract = await new web3.eth.Contract(Auction.abi, this.smart);
        const accounts = await web3.eth.getAccounts();
        this.setState({
          web3,
          contract,
          accounts: accounts[0]
        });
      } catch (e) {
        this.setState({ loading: false });
      }
    }

    render() {
      const { web3, contract, loading, accounts } = this.state;
      if (loading) {
        return <p>...</p>;
      }

      return (
        <InnerComponent
          web3={web3}
          contract={contract}
          accounts={accounts}
          {...this.props}
        />
      );
    }
  };

export default injectWeb3;