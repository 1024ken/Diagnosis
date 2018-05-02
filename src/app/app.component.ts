import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StyleDiagnosis } from '../providers/styleDiagnosis';
import { CompatibilityDiagnosis } from '../providers/compatibilityDiagnosis';
import { EntryProvider } from '../providers/entryProvider';
import { PairProvider } from '../providers/pairProvider';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    styleDiagnosis: StyleDiagnosis,
    compatibilityDiagnosis: CompatibilityDiagnosis,
    entryProvider: EntryProvider,
    pairProvider: PairProvider
  ) {
    platform.ready().then(() => {
      return styleDiagnosis.load();
    }).then(() => {
      return compatibilityDiagnosis.load();
    }).then(() => {
      return entryProvider.load();
    }).then(() => {
      return pairProvider.load();
    }).then(() => {
      if (!entryProvider.User) {
        this.rootPage = 'StyleDiagnosisEntryPage';
      } else {
        this.rootPage = 'TabsPage';
      }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}