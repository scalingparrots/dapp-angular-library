import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { MainRoutingModule } from './main-routing.module';

import { HomeComponent } from './home/home.component';
import { SwitchNetworkComponent } from './component/switch-network/switch-network.component';
import { ConnectWalletComponent } from './component/connect-wallet/connect-wallet.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, SwitchNetworkComponent, ConnectWalletComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [],
})
export class MainModule {}
