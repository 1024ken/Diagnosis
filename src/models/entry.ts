import { Item } from './item';

export class Entry extends Item {
  public nickname: string;
  public styleDiagnosis: any;
  public isUser: boolean;

  constructor() {
    super();
    this.nickname = null;
    this.styleDiagnosis = null;
    this.isUser = false;
  }

  copy(src: Entry) {
    this.nickname = src.nickname;
    let styleDiagnosis = {
      style: src.styleDiagnosis.style,
      big5Score: {}
    };
    Object.keys(src.styleDiagnosis.big5Score).forEach(key => {
      let data = src.styleDiagnosis.big5Score[key];
      styleDiagnosis.big5Score[key] = {
        score: data.score,
        active: data.active,
        rank: data.rank
      };
    });
    this.styleDiagnosis = styleDiagnosis; 
  }
}