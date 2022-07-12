import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';

import {DappAngularLibModule} from "../../projects/dapp-angular-lib/src/lib/dapp-angular-lib.module";
import {GlobalVariables} from "../../projects/dapp-angular-lib/src/lib/helpers/global-variables";

import {AppComponent} from './app.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DappAngularLibModule,
    MatSnackBarModule
  ],
  providers: [GlobalVariables],
  bootstrap: [AppComponent]
})
export class AppModule {
}
