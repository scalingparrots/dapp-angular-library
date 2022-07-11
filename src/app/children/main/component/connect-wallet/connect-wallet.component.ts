import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {WalletService} from "../../../../../../projects/dapp-library/src/lib/services/wallet.service";
import {GlobalVariables} from "../../../../../../projects/dapp-library/src/lib/helpers/global-variables";

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {
  win: any;

  constructor(
    private _walletService: WalletService,
    private _dialogRef: MatDialogRef<ConnectWalletComponent>
  ) {
    this.win = (window as any);

    _walletService.initMetaMaskExt();
  }

  ngOnInit(): void {
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables()
  }

  connectWallet(type: string) {
    this._walletService.connectWallet(type).then((_) => {
      this._dialogRef.close()
    })
  }
}
