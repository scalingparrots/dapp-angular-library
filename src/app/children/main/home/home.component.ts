import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BigNumber } from '@ethersproject/bignumber';
import {
  ChainId,
  NETWORK_INFO,
} from '../../../../../projects/dapp-angular-lib/src/lib/helpers/chain';
import { WalletService } from '../../../../../projects/dapp-angular-lib/src/lib/services/wallet.service';
import { NetworkService } from '../../../../../projects/dapp-angular-lib/src/lib/services/network.service';
import { ContractService } from '../../../../../projects/dapp-angular-lib/src/lib/services/contract.service';
import { MessageService } from '../../../../../projects/dapp-angular-lib/src/lib/services/message.service';
import { GlobalVariables } from '../../../../../projects/dapp-angular-lib/src/lib/helpers/global-variables';
import { ConnectWalletComponent } from '../component/connect-wallet/connect-wallet.component';
import { SwitchNetworkComponent } from '../component/switch-network/switch-network.component';

const abi = require('../../../core/abi/erc20.abi.json');
const BoosterAbi = require('../../../core/abi/Booster.json');
const LpTokenAbi = require('../../../core/abi/lpToken.abi.json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  win: any;
  primary_network = NETWORK_INFO[ChainId.Hardhat];
  supported_network = [
    NETWORK_INFO[ChainId.BSC],
    NETWORK_INFO[ChainId.Avalanche],
    NETWORK_INFO[ChainId.Palm],
    NETWORK_INFO[ChainId.Polygon],
  ];

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletService,
    private _networkService: NetworkService,
    private _contractService: ContractService,
    private _messageService: MessageService
  ) {
    this.win = window as any;

    // init network necessary
    _walletService.initNetwork(this.primary_network);

    // check account
    this.getProvider()
      // check network only if needed
      .then((_) => _networkService.checkNetwork(this.primary_network));
  }

  ngOnInit(): void {
    // this.readTotalBurn();
    // this.allowance('0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000');
    // this.approve('0x0000000000000000000000000000000000000000', 100);

    // this._contractService
    //   .readContract(
    //     '0xf403c135812408bfbe8713b5a23a04b3d48aae31',
    //     'https://red-lively-flower.quiknode.pro/d9fdbf99be306441445a56cd45479a6e5a277759/',
    //     BoosterAbi,
    //     'poolInfo',
    //     [32]
    //   )
    //   .then((res) => {
    //     console.log(res);
    //     //this.getCoinsBalances(res.lptoken, coinsLength);
    //   });

    this._contractService
      .readContract(
        '0x336AB186704C1b0E5Ef12402e8344DBeec5e00Bc',
        'https://red-lively-flower.quiknode.pro/d9fdbf99be306441445a56cd45479a6e5a277759',
        LpTokenAbi,
        'name',
        [],
        true
      )
      .then((coins) => {
        console.log({ coins });


      })
      .catch((error) => console.error(error));
  }

  // example of write contract
  async approve(spender: string, amount: number) {
    const decimals = 18;
    const am = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

    try {
      const tx = await this._contractService.writeContract(
        '0x0000000000000000000000000000000000000000',
        abi,
        'approve',
        [spender, am]
      );

      this._messageService.showMessage('Success');
    } catch (error: any) {
      this._messageService.showMessage(error.message);
    }
  }

  // example of read contract
  async readTotalBurn() {
    try {
      const totalBurn = await this._contractService.readContract(
        '0x0000000000000000000000000000000000000000',
        NETWORK_INFO[ChainId.BSC].rpcUrls[0],
        abi,
        'totalBurn'
      );

      this._messageService.showMessage(totalBurn.toLocaleString());
    } catch (error: any) {
      this._messageService.showMessage(error.message);
    }
  }

  // example of read contract
  async allowance(owner: string, spender: string) {
    try {
      const allowance = await this._contractService.readContract(
        '0x0000000000000000000000000000000000000000',
        NETWORK_INFO[ChainId.BSC].rpcUrls[0],
        abi,
        'allowance',
        [owner, spender]
      );

      this._messageService.showMessage(allowance.toLocaleString());
    } catch (error: any) {
      this._messageService.showMessage(error.message);
    }
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables();
  }

  async getProvider(): Promise<void> {
    await this._walletService.getWebProvider();
  }

  async disconnectWallet(): Promise<void> {
    await this._walletService.disconnectWallet();
  }

  openConnect(): void {
    this.dialog
      .open(ConnectWalletComponent)
      .afterClosed()
      // check network only if needed
      .subscribe((_) =>
        this._networkService.checkNetwork(this.primary_network)
      );
  }

  openSwitchNetwork(): void {
    this.dialog.open(SwitchNetworkComponent, {
      data: { supported_networks: this.supported_network },
    });
  }
}
