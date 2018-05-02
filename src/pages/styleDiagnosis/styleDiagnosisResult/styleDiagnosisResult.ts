import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingController, Content, Slides, Events } from 'ionic-angular';
import { AppConfig } from '../../../app/app.config';
import { EntryProvider } from '../../../providers/entryProvider';
import { StyleDiagnosis } from '../../../providers/styleDiagnosis';

@IonicPage()
@Component({
  selector: 'style-diagnosis-result',
  templateUrl: 'StyleDiagnosisResult.html',
})

export class StyleDiagnosisResultPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  mode: string = '';
  nickname: string = '';
  result: any;
  personality: any;
  resultHandler: any = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public entryProvider: EntryProvider,
    public styleDiagnosis: StyleDiagnosis
  ) {
    this.styleDiagnosis.load().then(() => {
      this.personality = this.styleDiagnosis.Personality;
    });

    let user = this.entryProvider.User;
    if (user) {
      this.nickname = user.nickname;
      this.result = user.styleDiagnosis;  
    }
  }

  ionViewWillEnter() {
    this.mode = this.navParams.get('mode');
    if (!this.mode) {
      this.mode = 'top';
    }

    if (this.mode == 'partner' || this.mode == 'result') {
      let entry = this.navParams.get('entry');
      this.nickname = entry.nickname;
      this.result = entry.styleDiagnosis;
      if (this.mode == 'partner') {
        this.viewCtrl.showBackButton(false);
      }
    } else {
      if (!this.resultHandler) {
        this.resultHandler = (styleDiagnosis) => {
          this.result = styleDiagnosis;
          this.entryProvider.User.styleDiagnosis = styleDiagnosis;
          this.entryProvider.save();          
        };
        this.events.subscribe('StyleDiagnosisQuestion:result', this.resultHandler);
      }

      let user = this.entryProvider.User;
      if (user) {
        this.nickname = user.nickname;
        this.result = user.styleDiagnosis;
      }
    }
  }

  ionViewDidEnter() {
    this.content.scrollToTop(0);
    this.slides.slideTo(0, 0);
  }

  ionViewWillUnload() {
    if (this.resultHandler) {
      this.events.unsubscribe('StyleDiagnosisQuestion:result');
      this.resultHandler = null;
    }
  }

  get PersonalityId() {
    return this.result ? this.personality[this.result.style].id : 0;
  }

  get ShortDescription() {
    if (!this.result) {
      return "";
    }
    let doc = this.personality[this.result.style].shortDescription;
    return this.replaceReturnCode(doc);
  }

  get LongDescription() {
    if (!this.result) {
      return "";
    }
    let doc = this.personality[this.result.style].longDescription;
    return this.replaceReturnCode(doc);
  }

  get Big5() {
    return this.styleDiagnosis.Big5;
  }

  private replaceReturnCode(doc: string) {
    doc = doc.replace(/\r\n/g, '<br>');
    return doc;
  }

  getRank(big5Type: string) {
    return this.result ? this.result.big5Score[big5Type].rank : 0;
  }

  goToStyleDiagnosisQuestionPage() {
    this.navCtrl.push('StyleDiagnosisQuestionPage');
  }

  goToCompatibilityDiagnosisResultPage() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: AppConfig.LOADING_CONTENT,
      duration: AppConfig.LOADING_DURATION,
    });
    loading.present();

    setTimeout(()=> {
      let entry = this.navParams.get('entry');
      this.navCtrl.push('CompatibilityDiagnosisResultPage', {
        mode: 'create',
        partner: entry
      }, {
        animate: false
      });
    }, AppConfig.LOADING_DURATION - 100);
  }

  close() {
    this.navCtrl.pop();
  }
}