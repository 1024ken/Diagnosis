import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { EntryProvider } from '../../../providers/entryProvider';
import { PairProvider } from '../../../providers/pairProvider';
import { StyleDiagnosis } from '../../../providers/styleDiagnosis';
import { CompatibilityDiagnosis } from '../../../providers/compatibilityDiagnosis';
import { Pair } from '../../../models/pair';
import { Entry } from '../../../models/entry';

@IonicPage()
@Component({
  selector: 'compatibility-diagnosis-result',
  templateUrl: 'compatibilityDiagnosisResult.html',
})

export class CompatibilityDiagnosisResultPage {
  @ViewChild(Slides) slides: Slides;

  mode: string;
  personality: any;
  big5: any;
  pair: Pair;
  result: any;
  compatibilityDisplayIndex: number;
  synchronizationRate: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public entryProvider: EntryProvider,
    public pairProvider: PairProvider,
    public styleDiagnosis: StyleDiagnosis,
    public compatibilityDiagnosis: CompatibilityDiagnosis,
  ) {
    this.styleDiagnosis.load().then(() => {
      this.personality = this.styleDiagnosis.Personality;
      this.big5 = this.styleDiagnosis.Big5;
      return this.compatibilityDiagnosis.load();
    });

    this.mode = this.navParams.get('mode');
    if (!this.mode) {
      this.mode = 'result';
    }

    if (this.mode == 'create') {
      let entry1 = new Entry();
      entry1.copy(this.entryProvider.User);
      let entry2 = this.navParams.get('partner');
      this.pair = this.create(entry1, entry2);
    } else if (this.mode == 'execute') {
      let entry1 = this.navParams.get('entry1');
      let entry2 = this.navParams.get('entry2');
      this.pair = this.create(entry1, entry2);
    } else {
      this.pair = this.navParams.get('pair');
    }

    this.synchronizationRate = 0;
  }

  ionViewWillEnter() {
    if (this.mode == 'create' || this.mode == 'execute') {
      this.viewCtrl.showBackButton(false);
    }
    this.compatibilityDisplayIndex = 0;
    if (this.mode == 'result') {
      this.synchronizationRate = this.pair.synchronizationRate;
    }
  }

  ionViewDidEnter() {
    if (this.synchronizationRate == this.pair.synchronizationRate) {
      return;
    }

    setTimeout(() => {
      let countUp = () => {
        if (this.synchronizationRate < this.pair.synchronizationRate) {
          this.synchronizationRate++;
          let duration = Math.round(this.pair.synchronizationRate / 800);
          setTimeout(countUp, duration);
        }
      };
      countUp();
    }, 800)
  }

  get Entry1(): Entry {
    return this.pair.entry1;
  }

  get Entry2(): Entry {
    return this.pair.entry2;
  }

  get Entry1Nickname(): string {
    return this.pair.entry1.nickname;
  }

  get Entry2Nickname(): string {
    return this.pair.entry2.nickname;
  }

  get Entry1PersonalityId(): number {
    return this.getPersonalityId(this.pair.entry1);
  }

  get Entry2PersonalityId(): number {
    return this.getPersonalityId(this.pair.entry2);
  }

  get Entry1GreatManName(): string {
    return this.getGreatManName(this.pair.entry1);
  }

  get Entry2GreatManName(): string {
    return this.getGreatManName(this.pair.entry2);
  }

  get SynchronizationRate(): number {
    return this.synchronizationRate;
  }

  get DisplaySynchronizationRate(): number {
    return this.synchronizationRate;
  }

  get Date(): number {
    return this.pair.date;
  }

  get Summary(): string {
    let x = this.pair.entry1.styleDiagnosis.style;
    let y = this.pair.entry2.styleDiagnosis.style;
    let summary = this.compatibilityDiagnosis.getSummary(x, y);
    return this.replaceReturnCode(this.replaceNames(summary));
  }

  private getPersonalityId(entry: Entry): number {
    let result = entry.styleDiagnosis;
    if (!this.personality || !result || !result.style) {
      return 0;
    }
    return this.personality[result.style].id;
  }

  private getGreatManName(entry: Entry): string {
    let result = entry.styleDiagnosis;
    if (!this.personality || !result || !result.style) {
      return '';
    }
    return this.personality[result.style].name;
  }

  get Big5() {
    return this.big5;
  }

  getRankStatus(big5Type: string, rank: number) {
    let entry1Rank = this.getEntry1Rank(big5Type);
    let entry2Rank = this.getEntry2Rank(big5Type);
    if (entry1Rank == rank && entry2Rank == rank) {
      return 'entries';
    } else if (entry1Rank == rank) {
      return 'entry1';
    } else if (entry2Rank == rank) {
      return 'entry2';
    }
    return 'none';
  }

  getEntry1Rank(big5Type: string) {
    let big5Score = this.pair.entry1.styleDiagnosis.big5Score;
    return big5Score[big5Type].rank;
  }

  getEntry2Rank(big5Type: string) {
    let big5Score = this.pair.entry2.styleDiagnosis.big5Score;
    return big5Score[big5Type].rank;
  }

  getDescription(big5Type: string): string {
    let x = this.pair.entry1.styleDiagnosis.big5Score;
    let y = this.pair.entry2.styleDiagnosis.big5Score;
    let description = this.compatibilityDiagnosis.getDescription(big5Type, x, y);
    return this.replaceReturnCode(this.replaceNames(description));
  }

  private replaceNames(doc: string) {
    let entry1Name = this.pair.entry1.nickname;
    let entry2Name = this.pair.entry2.nickname;
    doc = doc.replace(/__A__/g, '<span class="entry1-name">' + entry1Name + '</span>');
    doc = doc.replace(/__B__/g, '<span class="entry2-name">' + entry2Name + '</span>');
    return doc;
  }

  private replaceReturnCode(doc: string) {
    doc = doc.replace(/\r\n/g, '<br>');
    return doc;
  }

  private create(entry1: Entry, entry2: Entry) {
    let pair = new Pair();
    pair.entry1 = entry1;
    pair.entry2 = entry2;

    let x = pair.entry1.styleDiagnosis.big5Score;
    let y = pair.entry2.styleDiagnosis.big5Score;
    let r = this.compatibilityDiagnosis.calculateSynchronizationRate(x, y);
    pair.synchronizationRate = r;

    pair.date = Date.now();

    this.pairProvider.add(pair).save();
    return pair;
  }

  changeCompatibilityDisplay(index: number){
    this.compatibilityDisplayIndex = index;
    this.slides.slideTo(this.compatibilityDisplayIndex, 500);
  }

  getBig5DisplayType(index: number) {
    return this.big5[index].type;
  }

  getCompatibilityDisplayStatus(index: number) {
    return this.compatibilityDisplayIndex == index ? 'on' : 'off';
  }

  onCompatibilitySlideDidChange(){
    let index = this.slides.getActiveIndex();
    if (0 <= index && index < this.big5.length + 1) {
      this.compatibilityDisplayIndex = index;
    }
  }

  goToStyleDiagnosisResultPage(entry: Entry) {
    this.navCtrl.push('StyleDiagnosisResultPage', {
      mode: 'result',
      entry: entry
    });
  }

  close() {
    this.navCtrl.popToRoot();
  }
}