import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MatDialogModule} from '@angular/material/dialog';

import {MainRoutingModule} from "./main-routing.module";

import {HomeComponent} from "./home/home.component";
import {SwitchNetworkComponent} from "./component/switch-network/switch-network.component";
import {ConnectWalletComponent} from "./component/connect-wallet/connect-wallet.component";


@NgModule({
  declarations: [
    HomeComponent,
    SwitchNetworkComponent,
    ConnectWalletComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: []
})
export class MainModule {
}
