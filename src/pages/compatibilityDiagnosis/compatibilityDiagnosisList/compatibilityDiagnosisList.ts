import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController } from 'ionic-angular';
import { EntryProvider } from '../../../providers/entryProvider';
import { PairProvider } from '../../../providers/pairProvider';
import { StyleDiagnosis } from '../../../providers/styleDiagnosis';
import { Pair } from '../../../models/pair';
import { Entry } from '../../../models/entry';

@IonicPage()
@Component({
  selector: 'compatibility-diagnosis-list',
  templateUrl: 'compatibilityDiagnosisList.html',
})
export class CompatibilityDiagnosisListPage {

  personality: any;

  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public entryProvider: EntryProvider,
    public pairProvider: PairProvider,
    public styleDiagnosis: StyleDiagnosis
  ) {
    this.styleDiagnosis.load().then(() => {
      this.personality = this.styleDiagnosis.Personality;
    });
  }

  get Pairs() {
    return this.pairProvider.Pairs;
  }

  getPersonalityId(entry: Entry) {
    if (!this.personality) {
      return 0;
    }
    return this.personality[entry.styleDiagnosis.style].id;
  }

  delete(pair: Pair) {
    this.pairProvider.delete(pair).save();
  }

  selectAction() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'あたらしい相手',
          handler: () => {
            this.goToEntryPage();
          }
        },{
          text: 'これまでの相手',
          handler: () => {
            this.goToSelectPage();
          }
         },{
           text: 'キャンセル',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private goToEntryPage() {
    this.navCtrl.push('StyleDiagnosisEntryPage', {
      mode: 'partner'
    });
  }

  private goToSelectPage() {
    this.navCtrl.push('CompatibilityDiagnosisSelectPage'); 
  }

  goToResultPage(pair: Pair) {
    this.navCtrl.push('CompatibilityDiagnosisResultPage', {
      mode: 'result',
      pair: pair
    });
  }
}