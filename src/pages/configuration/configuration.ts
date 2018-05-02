import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { EntryProvider } from '../../providers/entryProvider';
import { Debug } from '../../providers/debug';
import { AppConfig } from '../../app/app.config';

@IonicPage()
@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html'
})
export class ConfigurationPage {

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public entryProvider: EntryProvider,
    private debug: Debug
  ) {
  }

  get IsDebug() {
    return !AppConfig.PRODUCTION;
  }

  goToProfileChangePage() {
    this.navCtrl.push('ProfileChangePage');
  }

  goToReferencePage() {
    this.navCtrl.push('ReferencePage');
  }

  goToLicensePage() {
    this.navCtrl.push('LicensePage');
  }

  deleteEntries() {
    let alert = this.alertCtrl.create();
    alert.setTitle('消すしんだんをえらぶ');

    this.entryProvider.Others.forEach(entry => {
      alert.addInput({
        type: 'checkbox',
        label: entry.nickname,
        value: entry.id,
        checked: false
      });  
    });

    alert.addButton('キャンセル');
    alert.addButton({
      text: 'OK',
      handler: ids => {
        if (ids && ids.length > 0) {
          ids.forEach(id => {
            let item = this.entryProvider.get(id);
            this.entryProvider.delete(item);
          });
          this.entryProvider.save();  
        }
      }
    });
    alert.present();
  }

  doDebug() {
    let alert = this.alertCtrl.create({
      title: 'Debug',
      buttons: [
        {
          text: '全相手と相性診断',
          handler: id => {
            if (id) {
              this.debug.addPairs(id);
            }
          }
        },
        {
          text: '全スタイルの相手を追加',
          handler: data => {
            this.debug.addEntries();
          }
        },
        {
          text: '全相性診断を削除',
          handler: data => {
            this.debug.deletePairs();
          }
        },
        {
          text: '全相手を削除',
          handler: data => {
            this.debug.deleteEntries();
          }
        },
        {
          text: 'キャンセル',
          role: 'cancel'
        }
      ]
    });
    this.entryProvider.Entries.forEach(entry => {
      alert.addInput({
        type: 'radio',
        label: entry.nickname,
        value: entry.id,
        checked: false
      });  
    });
    alert.present();
  }
}
