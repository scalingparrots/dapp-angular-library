import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../../../../../../projects/dapp-angular-lib/src/lib/services/wallet.service';
import { GlobalVariables } from '../../../../../../projects/dapp-angular-lib/src/lib/helpers/global-variables';
import {
  ChainId,
  NETWORK_INFO,
} from '../../../../../../projects/dapp-angular-lib/src/lib/helpers/chain';

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss'],
})
export class ConnectWalletComponent {
  win: any;
  primary_network = NETWORK_INFO[ChainId.BSC];

  constructor(
    private _walletService: WalletService,
    private _dialogRef: MatDialogRef<ConnectWalletComponent>
  ) {
    this.win = window as any;
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables();
  }

  connectWallet(type: string) {
    if (type === 'walletConnect') {
      this._dialogRef.close();
    }

    this._walletService.connectWallet(type).then(() => {
      this._dialogRef.close();
    });
  }
}
