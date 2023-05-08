import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { formatEther, parseEther } from 'ethers/lib/utils';
import { formatFixed } from '@ethersproject/bignumber';

import { WalletService } from '../../../../../projects/dapp-angular-lib/src/lib/services/wallet.service';
import { NetworkService } from '../../../../../projects/dapp-angular-lib/src/lib/services/network.service';
import { ContractService } from '../../../../../projects/dapp-angular-lib/src/lib/services/contract.service';
import { MessageService } from '../../../../../projects/dapp-angular-lib/src/lib/services/message.service';
import { GlobalVariables } from '../../../../../projects/dapp-angular-lib/src/lib/helpers/global-variables';

import { ConnectWalletComponent } from '../component/connect-wallet/connect-wallet.component';
import { SwitchNetworkComponent } from '../component/switch-network/switch-network.component';

import {
  ChainId,
  NETWORK_INFO,
} from '../../../../../projects/dapp-angular-lib/src/lib/helpers/chain';

const abi = require('../../../core/abi/erc20.abi.json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  win: any;

  primary_network = NETWORK_INFO[ChainId.BSCTestnet];
  supported_network = [
    NETWORK_INFO[ChainId.BSC],
    NETWORK_INFO[ChainId.Avalanche],
    NETWORK_INFO[ChainId.Palm],
    NETWORK_INFO[ChainId.Polygon],
  ];

  tBnbBalance: number = 0;
  loadingBalance: boolean = false;

  transferForm: FormGroup;
  tBusdContract: string = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
  tBusdAllowance: number = 0;
  loadingAllowance: boolean = false;

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
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

    this.transferForm = _formBuilder.group({
      amount: [''],
    });
  }

  ngOnInit(): void {}

  getWalletBalance(): void {
    this.loadingBalance = true;
    this._walletService
      .getWalletBalance(
        this.primary_network.rpcUrls[0],
        this.getGlobalVariables().wallet.address
      )
      .then((balance) => {
        this.tBnbBalance = Number(formatFixed(balance, 18));
        this.loadingBalance = false;
      });
  }

  handleApprove(): void {
    const amount = formatEther(this.transferForm.get('amount')?.value);
    this.approve(this.tBusdContract, amount);
  }

  // example of write contract
  async approve(spender: string, amount: string) {
    const amountFormatted = parseEther(amount);

    try {
      const tx = await this._contractService.writeContract(
        this.tBusdContract,
        abi,
        'approve',
        [spender, amountFormatted]
      );

      // transaction confirmed
      this._messageService.showMessage('Transaction confirmed');

      const receipt = await tx.wait();

      // transaction completed
      this._messageService.showMessage('Transaction completed');
    } catch (error: any) {
      this._messageService.showMessage(error.message);
    }
  }

  // example of read contract
  async allowance(owner: string, spender: string) {
    this.loadingAllowance = true;
    try {
      const allowance = await this._contractService.readContract(
        this.tBusdContract,
        this.primary_network.rpcUrls[0],
        abi,
        'allowance',
        [owner, spender]
      );

      this.tBusdAllowance = Number(formatFixed(allowance, 18));
      this.loadingAllowance = false;
    } catch (error: any) {
      this._messageService.showMessage(error.message);
      this.loadingAllowance = false;
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
