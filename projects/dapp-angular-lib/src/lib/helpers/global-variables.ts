import { Injectable } from '@angular/core';

export interface Wallet {
  address: string;
  addressShort: string;
  provider: any;
  network: any;
  signer: any;
}

@Injectable()
export class GlobalVariables {
  public isWalletConnected = false;
  public wallet: any = {};
  public type: string = '';
  public requiredNetwork: any;
  public isCordova: boolean = false;
  public projectId: string = 'ecae63993c45b2a437a6bdc68aa94c81';
  public infuraId: string = '047b078622fc49c3b514538f47389c30';
  public connectedProvider: any = {};
  public walletConnectProvider: any = {};
  public metaMaskExtProvider: any = false;
  public coinbaseExtProvider: any = false;
  public binanceExtProvider: any = false;
  public browserExtSupported: any = false;

  public setLocalStorage = (key: string, obj: any) => {
    window.localStorage.setItem(key, obj);
  };

  public getLocalStorage = (key: string) => {
    return window.localStorage.getItem(key);
  };
}
