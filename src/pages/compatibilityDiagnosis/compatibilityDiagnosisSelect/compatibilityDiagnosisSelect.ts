import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AppConfig } from '../../../app/app.config';
import { EntryProvider } from '../../../providers/entryProvider';
import { Entry } from '../../../models/entry';

@IonicPage()
@Component({
  selector: 'page-compatibility-diagnosis-select',
  templateUrl: 'CompatibilityDiagnosisSelect.html',
})
export class CompatibilityDiagnosisSelectPage {

  entries: Entry[];
  entry1Id: string = '';
  entry2Id: string = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public entryProvider: EntryProvider
  ) {
    this.entries = this.entryProvider.Entries;
  }

  nextPage() {
    if (!this.entry1Id || !this.entry2Id) {
      let alert = this.alertCtrl.create({
        message: 'ふたりえらんでください',
        buttons: [ 'OK' ]
      });
      return alert.present();
    }

    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: AppConfig.LOADING_CONTENT,
      duration: AppConfig.LOADING_DURATION,
    });
    loading.present();

    setTimeout(()=> {
      this.navCtrl.push('CompatibilityDiagnosisResultPage', {
        mode: 'execute',
        entry1: this.entryProvider.get(this.entry1Id),
        entry2: this.entryProvider.get(this.entry2Id)
      }, {
        animate: false
      });
    }, AppConfig.LOADING_DURATION);
  }
}