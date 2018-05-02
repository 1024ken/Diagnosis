import { Injectable } from '@angular/core';
import { StyleDiagnosis } from './styleDiagnosis';

export class QuestionCollection {
  index: number;
  questions: any[];
  items: QuestionItem[];

  constructor(index:number, questions: any[]) {
    this.index = index;
    this.questions = questions;
    this.items = [];
  }

  next(): boolean {
    if (this.items.length < this.questions.length) {
      let item = new QuestionItem(this.questions[this.items.length]);
      this.items.push(item);
      return true;
    }
    return false;
  }

  get IsAnswered(): boolean {
    return !this.items.find(item => !item.IsAnswered);
  }

  get IsFinished(): boolean {
    if (this.items.length < this.questions.length) {
      return false;
    }
    return !this.items.find(item => !item.IsAnswered);
  }
}

export class QuestionItem {
  number: number;
  type: string;
  text: string;
  scoreNo: number;
  scoreNeither: number;
  scoreYes: number;
  selected: string;

  constructor(question: any) {
    for (const f in question) {
      this[f] = question[f];
    }
    this.selected = null;
  }

  get IsAnswered() {
    return (this.selected != null);
  }
}

@Injectable()
export class Questionnaire {

  public readonly COLLECTION_COUNT: number = 5;
  public readonly COLLECTION_ITEM_COUNT: number = 8;

  private questions: any[];
  private collections: QuestionCollection[];
  private currentCollectionIndex: number;
  private answerCount: number;

  constructor(private styleDiagnosis: StyleDiagnosis) {
    this.collections = [];
    this.questions = [];
  }

  init() {
    this.collections = [];
    if (this.styleDiagnosis.Questions) {
      this.questions = this.styleDiagnosis.Questions.concat();
      this.shuffle(this.questions);
    }

    let q = this.questions.slice(0, this.COLLECTION_ITEM_COUNT);
    this.collections.push(new QuestionCollection(0, q));
    this.answerCount = 0;
    this.currentCollectionIndex = 0;
    this.nextItem();
  }

  private shuffle(array: any[]): void {
    //Fisher-Yates shuffle
    let n = array.length;
    for (let i=n-1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }

  get Collections(): QuestionCollection[] {
    return this.collections;
  }

  get CurrentCollection(): QuestionCollection {
    return this.collections[this.currentCollectionIndex];
  }

  get CurrentItems(): QuestionItem[] {
    let c = this.collections[this.currentCollectionIndex];
    return c ? c.items : null;
  }

  get QuestionCount(): number {
    return this.questions.length;
  }

  get AnswerCount(): number {
    return this.answerCount;
  }

  get Progress(): number {
    if (this.questions.length == 0) {
      return 0;
    }
    return Math.ceil(this.answerCount / this.questions.length * 100);
  }

  get IsFinished() {
    return this.questions.length > 0 && this.answerCount == this.questions.length;
  }

  answer(item: QuestionItem, selected: string) {
    if (!item.IsAnswered) {
      this.answerCount++;
    }
    item.selected = selected;
  }

  nextItem(): boolean {
    let collection = this.collections[this.collections.length-1];
    if (collection.IsFinished) {
      return false;
    }
    return collection.next();
  }

  nextCollection(): boolean {
    if (this.currentCollectionIndex < this.COLLECTION_COUNT) {
      this.currentCollectionIndex++;
    }

    if (this.collections.length < this.currentCollectionIndex + 1) {
      let i = this.collections.length;
      let s = i * this.COLLECTION_ITEM_COUNT;
      let q = this.questions.slice(s, s + this.COLLECTION_ITEM_COUNT);
      let c = new QuestionCollection(i, q);
      this.collections.push(c);
      this.nextItem();
      return true;
    }
    return false;
  }

  prevCollection(): boolean {
    if (this.currentCollectionIndex > 0) {
      this.currentCollectionIndex--;
      return true;
    }
    return false;
  }

  result(): any {
    return this.styleDiagnosis.makeDiagnoses(
      this.collections.reduce((prev, current) => prev.concat(current.items), [])
    );
  }
}
