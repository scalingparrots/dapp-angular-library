import {Injectable} from '@angular/core';
import WalletConnectProvider from "@walletconnect/web3-provider";
import {GlobalVariables} from "../helpers/global-variables";
import {ChainId, NETWORK_INFO} from "../helpers/chain";

export interface Network {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  },
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export interface Token {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  tokenImage: string;
  tokenNet: string;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  win: any;

  constructor(public _globalVariables: GlobalVariables) {
    this.win = (window as any);
  }

  public async changeNetwork(supported_network: Network): Promise<void> {
    if (this.win.ethereum) {
      try {
        await this.win.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: supported_network.chainId}],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await this.win.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [supported_network],
            });
          } catch (addError: any) {
            console.error(addError)
            // FIXME: create snackbar
            console.log("Switch Networks", addError.message);
          }
        }
      }
    } else {
      // FIXME: create snackbar
      console.log("Switch Networks", "Please connect your wallet to " + supported_network.chainName + " network");
    }
  }

  public async checkNetwork(supported_network: Network = NETWORK_INFO[1]): Promise<void> {
    const connected = this._globalVariables.getLocalStorage("connected");

    if (connected === 'true') {
      let chain;

      if (this.win.ethereum) {
        chain = this.win.ethereum.networkVersion;
      } else {
        this._globalVariables.walletConnectProvider = new WalletConnectProvider({
          infuraId: this._globalVariables.infuraId,
          rpc: this._globalVariables.requiredNetwork.rpc
        });
        this._globalVariables.walletConnectProvider.on("chainChanged", async (chainId: number) => {
          chain = chainId
        })
      }

      if (chain && chain !== ChainId[supported_network.chainName as unknown as number]) {
        await this.changeNetwork(supported_network);
      }
    }
  }

  public async addToken(token: Token): Promise<void> {
    if (this.win.ethereum) {
      const provider = this.win.ethereum;
      if (provider) {
        provider.sendAsync({
          method: 'metamask_watchAsset',
          params: {
            'type': 'ERC20',
            'options': {
              'address': token.tokenAddress,
              'symbol': token.tokenSymbol,
              'decimals': token.tokenDecimals,
              'image': token.tokenImage,
            },
          },
          id: Math.round(Math.random() * 100000),
        });
      }
    }
  }
}
