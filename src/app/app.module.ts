import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';

import {DappLibraryModule} from "dapp-library";
import {GlobalVariables} from "../../projects/dapp-library/src/lib/helpers/global-variables";

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DappLibraryModule
  ],
  providers: [GlobalVariables],
  bootstrap: [AppComponent]
})
export class AppModule {
}
