# Dapp Angular Lib

## About

This library is supposed to help the integration of web3 "standard" services.

## Features 🚀

🚀 Integrate it into your existing dApp with a few lines of code
<br/>
🚀 Supports WalletConnect, Metamask and Binance Chain Wallet
<br/>
🚀 Ready to use services to switch network and add new token to wallet
<br/>
🚀 Ready to use services to read and write from smart contracts
<br/>
🚀 Exportable chains list with providers info
<br/>
🚀 Supports all major browsers
<br/>
🚀 Fully customisable, style it as you want, support whatever tokens you want and much more
<br/>
🚀 Fully typescript supported

## Live demo

You can view a live demo [here]().

# Installing

## npm

```bash
$ npm install @scalingparrots/dapp-angular-lib
```

## Warnings running on angular 10 +

You have to update your `polyfills.ts` file adding this:

```ts
(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = require('process');
```

Add this to your `allowedCommonJsDependencies` in your `angular.json` file

```ts
"@walletconnect/web3-provider", 
"@walletconnect/window-metadata",
"@walletconnect/socket-transport",
"@walletconnect/environment",
"@metamask/detect-provider"
```

# Usage

It very simple to get dapp angular lib up and running, below is a simple example in how to get it working.

## your.module.ts
You need to import the `DappAngularLibModule` into your module file, example is just using a standard module example all
you need to do is insert `DappAngularLibModule` into your `imports` array.

```ts
import {DappAngularLibModule} from 'dapp-angular-lib';
import {AppComponent} from './app.component';
import {YourComponent} from './your.component';

@NgModule({
  declarations: [YourComponent],
  imports: [DappAngularLibModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class YourModule {
}
```

## your.component.ts
Init network and check wallet already connected, check right network connect otherwise switch to the primary one.

```ts
import {Component, OnInit} from '@angular/core';
import {
  ChainId,
  NETWORK_INFO,
  NetworkService,
  WalletService
} from "dapp-angular-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent implements OnInit {
  primary_network = NETWORK_INFO[ChainId.BSC];
  supported_network = [
    NETWORK_INFO[ChainId.BSC],
    NETWORK_INFO[ChainId.Avalanche],
    NETWORK_INFO[ChainId.Palm],
    NETWORK_INFO[ChainId.Polygon]
  ];

  constructor(
    private _walletService: WalletService,
    private _networkService: NetworkService,
  ) {
  }


  /**
   * On load
   */
  ngOnInit(): void {
    // init network necessary
    this._walletService.initNetwork(this.primary_network);

    // check account
    this.getProvider()
      // check network only if needed
      .then(_ => this._networkService.checkNetwork(this.primary_network));
  }

  async getProvider(): Promise<void> {
    await this._walletService.getWebProvider()
  }

  async disconnectWallet(): Promise<void> {
    await this._walletService.disconnectWallet()
  }
}
```

## your.component.ts
Connect wallet.
The `type` you need to pass in the `connectWallet()` function has to be one of this: ["metamask", "binance", "connectWallet"]

```ts
import {Component} from '@angular/core';
import {WalletService} from "dapp-angular-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent {

  constructor(private _walletService: WalletService) {}

  connectWallet(type: string) {
    this._walletService.connectWallet(type);
  }
}
```

## your.component.ts
Switch network.
The `network` you need to pass in the `switchNetwork()` function has to be an element of `NETWORK_ICON`

```ts
import {Component} from '@angular/core';
import {NetworkService} from "dapp-angular-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent {

  constructor(private _networkService: NetworkService) {}

  switchNetwork(network: any): void {
    this._networkService.changeNetwork(network);
  }
}
```

## your.component.ts
Contract calls

```ts
import {Component, OnInit} from '@angular/core';
import {ChainId, NETWORK_INFO, ContractService} from "dapp-angular-lib";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class YourComponent implements OnInit {

  constructor(private _contractService: ContractService) {}

  ngOnInit(): void {
    // example of read contract
    this.readTotalBurn();
    
    // example of write contract
    this.approve('0x7Fc31fa8a88Fe7a811d4d1FF538B177fF00d796f', 100);
  }

  async readTotalBurn() {
    try {
      const totalBurn = await this._contractService.readContract(
        '0xbDC3b3639f7AA19e623A4d603A3Fb7Ab20115A91',
        NETWORK_INFO[ChainId.BSC].rpcUrls[0],
        abi,
        'totalBurn'
      );

      console.log('Total burn:', totalBurn.toLocaleString());
    } catch (error: any) {
      console.log('Total burn', error.message);
    }
  }

  async approve(spender: string, amount: number) {
    const decimals = 18;
    const am = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

    try {
      const tx = await this._contractService.writeContract(
        '0xeF87F84cb04E9eE2eA5Cd3989ab62af4dFCa5E22',
        abi,
        'approve',
        [spender, am]
      );

      console.log('Approve:', tx);
    } catch (error: any) {
      console.log('Approve', error.message);
    }
  }
}
```
