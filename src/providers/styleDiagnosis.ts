import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StyleDiagnosis {
  private readonly QUESTIONS_ASSETS_URL: string = 'assets/data/questions.json';
  private readonly BIG5_ASSETS_URL: string = 'assets/data/big5.json';
  private readonly PERSONALITY_ASSETS_URL: string = 'assets/data/personality.json';

  private questions: any[];
  private big5: any[];
  private personality: any;

  constructor(private http: Http) {
    this.questions = null;
    this.big5 = null;
    this.personality = null;
  }

  get IsLoaded(): boolean {
    return this.questions && this.big5 && this.personality;
  }

  get Questions(): any[] {
    return this.questions;
  }

  get Big5(): any[] {
    return this.big5;
  }

  get Personality(): any {
    return this.personality;
  }

  makeDiagnoses(answers: any[]): any {
    let big5Score:any = {
      openness: { score: 0, active: false, rank: 0 },
      conscientiousness: { score: 0, active: false, rank: 0 },
      extroversion: { score: 0, active: false, rank: 0 },
      agreeableness: { score: 0, active: false, rank: 0 },
      neuroticism: { score: 0, active: false, rank: 0 }
    };

    answers.forEach(item => {
      if (item.type == 'openness')
        big5Score.openness.score += item[item.selected];
      else if (item.type == 'conscientiousness')
        big5Score.conscientiousness.score += item[item.selected];
      else if (item.type == 'extroversion')
        big5Score.extroversion.score += item[item.selected];
      else if (item.type == 'agreeableness')
        big5Score.agreeableness.score += item[item.selected];
      else if (item.type == 'neuroticism')
        big5Score.neuroticism.score += item[item.selected];
    });

    Object.keys(big5Score).forEach(key => {
      let score = big5Score[key].score; 
      let element = this.big5.find(e => e.type == key);

      let threshold = element.threshold;
      big5Score[key].active = score > threshold ? true : false;

      let fiveThreshold = element.fiveThreshold;
      if (fiveThreshold[0] <= score &&  score < fiveThreshold[1]) {
        big5Score[key].rank = 0;
      } else if (fiveThreshold[1] <= score &&  score < fiveThreshold[2]) {
        big5Score[key].rank = 1;
      } else if (fiveThreshold[2] <= score &&  score < fiveThreshold[3]) {
        big5Score[key].rank = 2;
      } else if (fiveThreshold[3] <= score &&  score < fiveThreshold[4]) {
        big5Score[key].rank = 3;
      } else if (fiveThreshold[4] <= score &&  score <= fiveThreshold[5]){
        big5Score[key].rank = 4;
      }
    });

    let style = (big5Score.openness.active << 4)
              + (big5Score.conscientiousness.active << 3)
              + (big5Score.extroversion.active << 2)
              + (big5Score.agreeableness.active << 1)
              + (big5Score.neuroticism.active + 0);

    return {
      style: ('00000' + style.toString(2)).slice(-5),
      big5Score: big5Score
    };
  }

  load(): Promise<any> {
    if (this.questions && this.big5 && this.personality) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      let ob = this.http.get(this.QUESTIONS_ASSETS_URL);
      ob.map(res=>res.json()).subscribe(
        data=>{
          this.questions = data;
          resolve();
        },
        err =>{
          reject(err);
        }
      );
    }).then(result => {
      return new Promise((resolve, reject) => {
        let ob = this.http.get(this.BIG5_ASSETS_URL);
        ob.map(res=>res.json()).subscribe(
          data=>{
            this.big5 = data;
            resolve();
          },
          err=>{
            reject(err);
          }
        );
      });
    }).then(result => {
      return new Promise((resolve, reject) => {
        let ob = this.http.get(this.PERSONALITY_ASSETS_URL);
        ob.map(res=>res.json()).subscribe(
          data=>{
            this.personality = data;
            resolve();
          },
          err=>{
            reject(err);
          }
        );
      });
    });
  }
}
