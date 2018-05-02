import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { EntryProvider } from '../../../providers/entryProvider';

@IonicPage()
@Component({
  selector: 'profile-change',
  templateUrl: 'ProfileChange.html',
})

export class ProfileChangePage {

  nickname: string = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public entryProvider: EntryProvider
  ) {
    this.nickname = this.entryProvider.User.nickname;
  }

  change() {
    if (this.nickname.length < 1 || this.nickname.length > 8) {
      let alert = this.alertCtrl.create({
        message: '１文字以上、８文字以内にしてください',
        buttons: [ 'OK' ]
      });
      alert.present();
      return;  
    }

    this.entryProvider.User.nickname = this.nickname;
    this.entryProvider.save().then(()=> {
      this.navCtrl.pop();
    });
  }
}