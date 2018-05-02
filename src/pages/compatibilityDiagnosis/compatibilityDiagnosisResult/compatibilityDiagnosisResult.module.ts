import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoundProgressModule, RoundProgressConfig } from 'angular-svg-round-progressbar';
import { AppConfig } from '../../../app/app.config';
import { CompatibilityDiagnosisResultPage } from './compatibilityDiagnosisResult';

@NgModule({
  declarations: [
    CompatibilityDiagnosisResultPage
  ],
  imports: [
    IonicPageModule.forChild(CompatibilityDiagnosisResultPage),
    RoundProgressModule
  ]
})
export class CompatibilityDiagnosisResultPageModule {
  constructor(roundProgressConfig: RoundProgressConfig) {
    roundProgressConfig.setDefaults({
      color: AppConfig.ROUND_PROGRESS_COLOR,
      stroke: AppConfig.ROUND_PROGRESS_STROKE,
      responsive: true,
      duration: 1
    });
  }
}
