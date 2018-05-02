import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundProgressModule, RoundProgressConfig } from 'angular-svg-round-progressbar';
import { AppConfig } from '../../../app/app.config';
import { CompatibilityDiagnosisListPage } from './compatibilityDiagnosisList';

@NgModule({
  declarations: [
    CompatibilityDiagnosisListPage
  ],
  imports: [
    IonicPageModule.forChild(CompatibilityDiagnosisListPage),
    RoundProgressModule
  ]
})
export class CompatibilityDiagnosisListPageModule {
  constructor(roundProgressConfig: RoundProgressConfig) {
    roundProgressConfig.setDefaults({
      color: AppConfig.ROUND_PROGRESS_COLOR,
      stroke: AppConfig.ROUND_PROGRESS_STROKE,
      responsive: true,
      animationDelay: 500
    });
  }
}
