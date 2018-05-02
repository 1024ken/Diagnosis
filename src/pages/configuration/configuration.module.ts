import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigurationPage } from './configuration';
import { Debug } from '../../providers/debug';

@NgModule({
  declarations: [
    ConfigurationPage
  ],
  imports: [
    IonicPageModule.forChild(ConfigurationPage)
  ],
  providers: [
    Debug
  ]
})
export class ConfigurationPageModule {}