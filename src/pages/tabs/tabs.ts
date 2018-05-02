import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = "StyleDiagnosisResultPage";
  tab2Root = "CompatibilityDiagnosisListPage";
  tab3Root = "ConfigurationPage";

  constructor() {
  }
}