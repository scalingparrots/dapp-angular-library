import {Injectable} from '@angular/core';
import {ethers, providers} from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {GlobalVariables} from "../helpers/global-variables";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  win: any;

  constructor(public _globalVariables: GlobalVariables) {
    this.win = (window as any);
  }

  private async getWebProvider() {
    let provider: any;
    if (this.win.ethereum) {
      provider = this.win.ethereum;
    } else {
      provider = new WalletConnectProvider({
        infuraId: this._globalVariables.infuraId,
        rpc: this._globalVariables.requiredNetwork.rpc
      });
    }

    return new ethers.providers.Web3Provider(provider);
  }

  private async getContract(contractAddress: string, abi: any) {
    const provider = await this.getWebProvider();
    const signer = provider.getSigner();

    return new ethers.Contract(
      contractAddress,
      abi,
      signer ? signer : provider
    );
  }

  public writeContract(contractAddress: string, abi: any): Promise<ethers.Contract> {
    return this.getContract(contractAddress, abi);
  }

  public async readContract(contractAddress: string, rpcProvider: string, abi: any, methodName: string, bySigner = false) {
    let provider;
    let signer;

    if (bySigner) {
      provider = await this.getWebProvider();
      signer = provider.getSigner();
    } else {
      provider = new providers.JsonRpcProvider(rpcProvider);
    }

    const contractManager = new ethers.Contract(
      contractAddress,
      abi,
      bySigner ? signer : provider
    );

    return contractManager[methodName]();
  }
}
