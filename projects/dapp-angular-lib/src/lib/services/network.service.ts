import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { GlobalVariables } from '../helpers/global-variables';
import { ChainId, NETWORK_INFO } from '../helpers/chain';

export interface Network {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
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
  providedIn: 'root',
})
export class NetworkService {
  win: any;

  constructor(
    public _globalVariables: GlobalVariables,
    private _messageService: MessageService
  ) {
    this.win = window as any;
  }

  /***
   * Send request to switch wallet network
   * @param supported_network The network to switch to
   */
  public async changeNetwork(supported_network: Network): Promise<void> {
    const type = this._globalVariables.getLocalStorage('type');

    if (type === 'metamask' && this.win.ethereum) {
      try {
        return await this._globalVariables.metaMaskExtProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: supported_network.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            return await this._globalVariables.metaMaskExtProvider.request({
              method: 'wallet_addEthereumChain',
              params: [supported_network],
            });
          } catch (addError: any) {
            this._messageService.showMessage(
              'Switch Networks: ' + addError.message,
              3000
            );
          }
        } else {
          this._messageService.showMessage(
            'Switch Networks: ' + switchError.message,
            3000
          );
        }
      }
    } else if (type === 'coinbase' && this.win.ethereum) {
      try {
        return await this._globalVariables.coinbaseExtProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: supported_network.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            return await this._globalVariables.coinbaseExtProvider.request({
              method: 'wallet_addEthereumChain',
              params: [supported_network],
            });
          } catch (addError: any) {
            this._messageService.showMessage(
              'Switch Networks: ' + addError.message,
              3000
            );
          }
        } else {
          this._messageService.showMessage(
            'Switch Networks: ' + switchError.message,
            3000
          );
        }
      }
    } else if (type === 'binance' && this.win.BinanceChain) {
      if (supported_network.chainId === '0x38') {
        this._globalVariables.binanceExtProvider.switchNetwork('bsc-mainnet');
      } else if (supported_network.chainId === '0x61') {
        this._globalVariables.binanceExtProvider.switchNetwork('bsc-testnet');
      } else if (supported_network.chainId === '0x1') {
        this._globalVariables.binanceExtProvider.switchNetwork('eth-mainnet');
      } else {
        this._messageService.showMessage(
          'Switch Networks: Please connect your wallet to ' +
            supported_network.chainName +
            ' network'
        );
      }
    } else {
      this._messageService.showMessage(
        'Switch Networks: Please connect your wallet to ' +
          supported_network.chainName +
          ' network'
      );
    }
  }

  /***
   * Check if the network provided is the supported one
   * @param supported_network The network to check
   */
  public async checkNetwork(
    supported_network: Network = NETWORK_INFO[1]
  ): Promise<void> {
    const connected = this._globalVariables.getLocalStorage('connected');
    const type = this._globalVariables.getLocalStorage('type');

    if (connected === 'true') {
      let chain;

      if (type === 'metamask' && this.win.ethereum) {
        chain = this.win.ethereum.networkVersion;
      } else if (type === 'binance' && this.win.BinanceChain) {
        chain = this.win.BinanceChain.chainId;
      } else if (
        type === 'walletConnect' &&
        this._globalVariables.walletConnectProvider.chainId
      ) {
        chain = this._globalVariables.walletConnectProvider.chainId;
        this._globalVariables.walletConnectProvider.on(
          'chainChanged',
          async (chainId: number) => {
            chain = chainId;
          }
        );
      }

      if (
        chain &&
        chain !== ChainId[supported_network.chainName as unknown as number] &&
        chain !== supported_network.chainId
      ) {
        await this.changeNetwork(supported_network);
      }
    }
  }

  /***
   * Add new token to Metamask wallet
   * @param token The token info to add
   */
  public async addToken(token: Token): Promise<void> {
    const type = this._globalVariables.getLocalStorage('type');

    if (type === 'metamask' && this.win.ethereum) {
      const provider = this.win.ethereum;

      provider.sendAsync({
        method: 'metamask_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.tokenAddress,
            symbol: token.tokenSymbol,
            decimals: token.tokenDecimals,
            image: token.tokenImage,
          },
        },
        id: Math.round(Math.random() * 100000),
      });
    } else {
      // TODO: investigate add token with binance chain wallet

      this._messageService.showMessage(
        'Add token: Please add ' + token.tokenName + ' token to your wallet'
      );
    }
  }
}
