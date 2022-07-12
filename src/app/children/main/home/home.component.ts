import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BigNumber} from "ethers";
import {ChainId, NETWORK_INFO} from "../../../../../projects/dapp-angular-lib/src/lib/helpers/chain";
import {WalletService} from "../../../../../projects/dapp-angular-lib/src/lib/services/wallet.service";
import {NetworkService} from "../../../../../projects/dapp-angular-lib/src/lib/services/network.service";
import {ContractService} from "../../../../../projects/dapp-angular-lib/src/lib/services/contract.service";
import {GlobalVariables} from "../../../../../projects/dapp-angular-lib/src/lib/helpers/global-variables";
import {ConnectWalletComponent} from "../component/connect-wallet/connect-wallet.component";
import {SwitchNetworkComponent} from "../component/switch-network/switch-network.component";

const abi = require('../../../../app/core/abi/coc.abi.json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  win: any;
  primary_network = NETWORK_INFO[ChainId.BSC];
  supported_network = [
    NETWORK_INFO[ChainId.BSC],
    NETWORK_INFO[ChainId.Avalanche],
    NETWORK_INFO[ChainId.Palm],
    NETWORK_INFO[ChainId.Polygon]
  ];

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletService,
    private _networkService: NetworkService,
    private _contractService: ContractService
  ) {
    this.win = (window as any);

    // init network necessary
    _walletService.initNetwork(this.primary_network);

    // check account
    this.getProvider()
      // check network only if needed
      .then(_ => _networkService.checkNetwork(this.primary_network));
  }

  ngOnInit(): void {
    // this.readTotalBurn();
    // this.approve('0x7Fc31fa8a88Fe7a811d4d1FF538B177fF00d796f', 1000);
  }

  // example of write contract
  async approve(spender: string, amount: number) {
    const contract = await this._contractService.writeContract(
      '0xbDC3b3639f7AA19e623A4d603A3Fb7Ab20115A91',
      abi
    );

    try {
      let transaction = contract['approve'](
        spender,
        BigNumber.from(amount)
      );

      const tx = await transaction;
      console.log({tx})
    } catch (error: any) {
      // FIXME: create snackbar
      console.log("Approve", error.message);
    }
  }

  // example of read contract
  readTotalBurn() {
    this._contractService.readContract(
      '0xbDC3b3639f7AA19e623A4d603A3Fb7Ab20115A91',
      NETWORK_INFO[ChainId.BSC].rpcUrls[0],
      abi,
      'totalBurn'
    ).then((r: any) => {
      console.log(r.toLocaleString())
    });
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables()
  }

  async getProvider(): Promise<void> {
    await this._walletService.getWebProvider()
  }

  async disconnectWallet(): Promise<void> {
    await this._walletService.disconnectWallet()
  }

  openConnect(): void {
    this.dialog.open(ConnectWalletComponent)
      .afterClosed()
      // check network only if needed
      .subscribe(_ => this._networkService.checkNetwork(this.primary_network))
  }

  openSwitchNetwork(): void {
    this.dialog.open(SwitchNetworkComponent, {
      data: {supported_networks: this.supported_network}
    })
  }
}
