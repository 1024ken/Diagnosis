import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content, Events } from 'ionic-angular';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppConfig } from '../../../app/app.config';
import { EntryProvider } from '../../../providers/entryProvider';
import { Questionnaire, QuestionItem } from '../../../providers/questionnaire';
import { Entry } from '../../../models/entry';

@IonicPage()
@Component({
  selector: 'style-diagnosis-question',
  templateUrl: 'StyleDiagnosisQuestion.html',
})

export class StyleDiagnosisQuestionPage {
  @ViewChild(Content) content: Content;

  mode: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public events: Events,
    public questionnaire: Questionnaire,
    public entryProvider: EntryProvider
  ) {
  }

  ionViewWillEnter() {
    this.questionnaire.init();
    this.mode = this.navParams.get('mode');
    if (!this.mode) {
      this.mode = 'top';
    }
  }

  get IsAnswered(): boolean {
    let c = this.questionnaire.CurrentCollection;
    return (c) ? c.IsAnswered : false;
  }

  get IsFirstCollection(): boolean {
    let c = this.questionnaire.CurrentCollection;
    return (c) ? c.index == 0 : false;
  }

  get IsLastCollection(): boolean {
    let c = this.questionnaire.CurrentCollection;
    return (c) ? c.index + 1 == this.questionnaire.COLLECTION_COUNT : false;
  }

  answer(item: QuestionItem, selected: string, last: boolean) {
    this.questionnaire.answer(item, selected);

    if (last && this.questionnaire.CurrentCollection.IsAnswered) {
      this.questionnaire.nextItem();

      setTimeout(function() {
        this.content.resize();
        this.content.scrollToBottom(200);
      }.bind(this), 100);
    }
  }

  prevCollection() {
    this.questionnaire.prevCollection();
    this.content.resize();
    this.content.scrollToTop(0);
  }

  nextCollection() {
    this.questionnaire.nextCollection();
    this.content.resize();
    this.content.scrollToTop(0);
  }

  result() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: AppConfig.LOADING_CONTENT,
      duration: AppConfig.LOADING_DURATION,
    });
    loading.present();

    setTimeout(()=> {
      let result = this.questionnaire.result();
      if (this.mode == 'init') {
        let entry = new Entry();
        entry.nickname = this.navParams.get('nickname');
        entry.styleDiagnosis = result;
        entry.isUser = true;
        this.entryProvider.add(entry).save();

        this.navCtrl.setRoot('TabsPage');
      } else if (this.mode == 'partner') {
        let entry = new Entry();
        entry.nickname = this.navParams.get('nickname');
        entry.styleDiagnosis = result;
        this.entryProvider.add(entry).save();

        this.navCtrl.push('StyleDiagnosisResultPage', {
          mode: this.mode,
          entry: entry
        });
      } else {
        this.events.publish('StyleDiagnosisQuestion:result', result);

        this.navCtrl.pop();
      }  
    }, Math.floor(AppConfig.LOADING_DURATION * 0.3));
  }
}