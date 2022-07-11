import {Injectable} from '@angular/core';
import {ethers} from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import detectEthereumProvider from "@metamask/detect-provider";
import {GlobalVariables} from "../helpers/global-variables";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  win: any;

  constructor(public _globalVariables: GlobalVariables) {
    this.win = (window as any);
  }

  private async initWalletConnect() {
    this._globalVariables.walletConnectProvider = new WalletConnectProvider({
      infuraId: this._globalVariables.infuraId,
      rpc: this._globalVariables.requiredNetwork.rpc
    });

    // Subscribe to account change
    this._globalVariables.walletConnectProvider.on("accountsChanged", (accounts: string[]) => {
      this._globalVariables.wallet.address = accounts[0];
      const leftSide = this._globalVariables.wallet.address.substring(0, 5);
      const rightSide = this._globalVariables.wallet.address.substring(this._globalVariables.wallet.address.length - 4, this._globalVariables.wallet.address.length);
      this._globalVariables.wallet.addressShort = leftSide + "..." + rightSide;
    });

    // Subscribe to chainId change
    this._globalVariables.walletConnectProvider.on("chainChanged", async (chainId: number) => {
      if (this._globalVariables.requiredNetwork.chainId != chainId) {
        this._globalVariables.isWalletConnected = false;
        // FIXME: create snackbar
        console.log("Switch Networks", "Please connect your wallet to " + this._globalVariables.requiredNetwork.name + " network");
      }
    });

    // Subscribe to session disconnection
    this._globalVariables.walletConnectProvider.on("disconnect", (code: number, reason: string) => {
      this._globalVariables.isWalletConnected = false;
    });
  }

  private async setConnectLinkForMobile() {
    //for when loaded within cordova shell app. need to wait until the button is available in document and set listener on it
    setTimeout(() => {
      if (this.win.document.getElementById("walletconnect-connect-button-Connect") != null) {
        this.win.document.getElementById("walletconnect-connect-button-Connect").onclick = (res: any) => {
          const url = (res as any).target.href;
          this.win.cordova.InAppBrowser.open(url, "_system");
        }
      } else {
        this.setConnectLinkForMobile();
      }
    }, (500));
  }

  private async setVariables(ethAddresses: any) {
    this._globalVariables.wallet.signer = this._globalVariables.wallet.provider.getSigner();
    this._globalVariables.wallet.network = await this._globalVariables.wallet.provider.getNetwork();

    if (Array.isArray(ethAddresses)) {
      this._globalVariables.wallet.address = ethAddresses[0];
    } else if (ethAddresses.result) {
      this._globalVariables.wallet.address = ethAddresses.result[0];
    } else {
      // FIXME: create snackbar
      console.log("Error getting address. Please try again or contact us");
      return;
    }

    this._globalVariables.isWalletConnected = true;
    const leftSide = this._globalVariables.wallet.address.substring(0, 5);
    const rightSide = this._globalVariables.wallet.address.substring(this._globalVariables.wallet.address.length - 4, this._globalVariables.wallet.address.length);
    this._globalVariables.wallet.addressShort = leftSide + "..." + rightSide;
    this._globalVariables.setLocalStorage("connected", true);
  }

  public initMetaMaskExt() {
    if (this.win.ethereum) {
      this._globalVariables.browserExtSupported = true;

      if (this.win.ethereum.providers) {
        const providers = this.win.ethereum.providers;

        for (let i = 0; i < providers.length; i++) {
          const tmpProvider = providers[i];

          if (tmpProvider.isMetaMask) {
            this._globalVariables.metaMaskExtProvider = tmpProvider;
          }
        }
      } else {
        if (this.win.ethereum.isMetaMask) {
          this._globalVariables.metaMaskExtProvider = this.win.ethereum;
        }
      }
    }
  }

  public async getWebProvider() {
    const connected = this._globalVariables.getLocalStorage("connected");
    if (connected === 'true') {
      let ethAddresses = [];

      const provider: any = await detectEthereumProvider();

      this._globalVariables.wallet.provider = new ethers.providers.Web3Provider(provider);
      ethAddresses = await this._globalVariables.wallet.provider.send("eth_requestAccounts", []);
      this._globalVariables.connectedProvider = this._globalVariables.metaMaskExtProvider;

      await this.setVariables(ethAddresses);
    }
  }

  public getGlobalVariables(): any {
    return this._globalVariables;
  }

  public async connectWallet(type: string) {
    try {
      let ethAddresses = [];
      if (type == "walletConnect") {
        this.initWalletConnect();
        if (this._globalVariables.isCordova) {
          this.setConnectLinkForMobile();
        }
        ethAddresses = await this._globalVariables.walletConnectProvider.enable();
        this._globalVariables.wallet.provider = new ethers.providers.Web3Provider(this._globalVariables.walletConnectProvider);
        this._globalVariables.connectedProvider = this._globalVariables.walletConnectProvider;
      } else if (type == "metamask") {
        this._globalVariables.wallet.provider = new ethers.providers.Web3Provider(this._globalVariables.metaMaskExtProvider);
        ethAddresses = await this._globalVariables.wallet.provider.send("eth_requestAccounts", []);
        this._globalVariables.connectedProvider = this._globalVariables.metaMaskExtProvider;
      }

      await this.setVariables(ethAddresses);
      return ethAddresses[0];
    } catch (err: any) {
      console.error(err.message);
    }
  }

  public async disconnectWallet() {
    this._globalVariables.setLocalStorage("connected", false);
    await this._globalVariables.connectedProvider.disconnect();
  }
}
