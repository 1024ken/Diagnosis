import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompatibilityDiagnosis {
  private readonly BIG5_COMBINATION_ASSETS_URL: string
    = 'assets/data/big5_combination.json';
  private readonly PERSONALITY_COMPATIBILITY_ASSETS_URL: string
    = 'assets/data/personality_compatibility.json';

  private big5Combination: any;
  private personalityCompatibility: any;

  constructor(private http: Http) {
    this.big5Combination = null;
    this.personalityCompatibility = null;
  }

  get IsLoaded(): boolean {
    return this.big5Combination && this.personalityCompatibility;
  }

  calculateSynchronizationRate(xBig5Score:any, yBig5Score:any): number {
    let keys = Object.keys(xBig5Score)
    return Math.round(keys.map(key => {
      let xScore = xBig5Score[key].score;
      let yScore = yBig5Score[key].score;
      return 1 - Math.abs(xScore - yScore) / 16;
    }).reduce((prev, current) => prev + current) / keys.length * 100);
  }

  getSummary(xStyle: string, yStyle: string): string {
    return this.personalityCompatibility[xStyle][yStyle];
  }

  getDescription(big5Type: string, xBig5Score:any, yBig5Score:any): string {
    let xLevel = xBig5Score[big5Type].active ? "high" : "low";
    let yLevel = yBig5Score[big5Type].active ? "high" : "low";
    return this.big5Combination[big5Type][xLevel][yLevel];
  }

  load(): Promise<any> {
    if (this.big5Combination && this.personalityCompatibility) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      let ob = this.http.get(this.BIG5_COMBINATION_ASSETS_URL);
      ob.map(res=>res.json()).subscribe(
        data=>{
          this.big5Combination = data;
          resolve();
        },
        err =>{
          reject(err);
        }
      );
    }).then(result => {
      return new Promise((resolve, reject) => {
        let ob = this.http.get(this.PERSONALITY_COMPATIBILITY_ASSETS_URL);
        ob.map(res=>res.json()).subscribe(
          data=>{
            this.personalityCompatibility = data;
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
