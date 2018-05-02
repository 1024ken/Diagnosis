import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ProfileChangePage } from './profileChange';

@NgModule({
  declarations: [
    ProfileChangePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileChangePage),
  ],
})
export class ProfileChangePageModule {}
