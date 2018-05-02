import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { EntryProvider } from '../providers/entryProvider';
import { PairProvider } from '../providers/pairProvider';
import { StyleDiagnosis } from '../providers/styleDiagnosis';
import { Questionnaire } from '../providers/questionnaire';
import { CompatibilityDiagnosis } from '../providers/compatibilityDiagnosis';

@NgModule({
  declarations: [
    MyApp
  ],

  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      backButtonText: " ",
      tabsHideOnSubPages: true,
      swipeBackEnabled: false
    }),
    IonicStorageModule.forRoot(),
  ],

  bootstrap: [IonicApp],

  entryComponents: [
    MyApp
  ],

  providers: [
    StatusBar,
    SplashScreen,
    EntryProvider,
    PairProvider,
    StyleDiagnosis,
    Questionnaire,
    CompatibilityDiagnosis,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}