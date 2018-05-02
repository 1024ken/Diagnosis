import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'style-diagnosis-entry',
  templateUrl: 'StyleDiagnosisEntry.html',
})
export class StyleDiagnosisEntryPage {
  mode: string = '';
  nickname: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
  ) {}

  ionViewWillEnter() {
    this.mode = this.navParams.get('mode');
    if (!this.mode) {
      this.mode = 'init';
    }
  }

  nextPage() {
    if (this.nickname.length < 1 || this.nickname.length > 8) {
      let alert = this.alertCtrl.create({
        message: '１文字以上、８文字以内にしてください',
        buttons: [ 'OK' ]
      });
      return alert.present();
    }

    this.navCtrl.push('StyleDiagnosisQuestionPage', {
      mode: this.mode,
      nickname: this.nickname
    });
  }
}