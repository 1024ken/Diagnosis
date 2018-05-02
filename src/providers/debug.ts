import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { StyleDiagnosis } from './styleDiagnosis';
import { CompatibilityDiagnosis } from './compatibilityDiagnosis';
import { EntryProvider } from './entryProvider';
import { PairProvider } from './pairProvider';
import { Entry } from '../models/entry';
import { Pair } from '../models/pair';

@Injectable()
export class Debug {
  constructor(
    private styleDiagnosis: StyleDiagnosis,
    private compatibilityDiagnosis: CompatibilityDiagnosis,
    private entryProvider: EntryProvider,
    private pairProvider: PairProvider
  ) {
  }

  addEntries() {
    let personality = this.styleDiagnosis.Personality;
    Object.keys(personality).sort().map(key => {
      return {
        id: uuid(),
        isUser: false,
        nickname: ('00'+personality[key].id).slice(-2)+':'+personality[key].name,
        styleDiagnosis: {
          style: key,
          big5Score: [
            "openness",
            "conscientiousness",
            "agreeableness",
            "extroversion",
            "neuroticism",
          ].reduce((s, e, i) => {
            let t = key.substring(i, i+1);
            s[e] = (t == '0') ? { score: 8, active: false, rank: 0 }
                              : { score: 24, active: true, rank: 4 };
            return s;
          }, {})
        }
      };
    }).forEach(e => {
      this.entryProvider.add(e);
    });
    this.entryProvider.save();
  }

  deleteEntries() {
    this.entryProvider.Others.concat().forEach(e => this.entryProvider.delete(e));
    this.entryProvider.save();
  }

  addPairs(id: string) {
    let entry1 = this.entryProvider.get(id) as Entry;
    if (!entry1) {
      return;
    }

    this.entryProvider.Entries.sort((a, b) => {
      return b.nickname.localeCompare(a.nickname);
    }).forEach(entry2 => {
      let x = entry1.styleDiagnosis.big5Score;
      let y = entry2.styleDiagnosis.big5Score;
      let r = this.compatibilityDiagnosis.calculateSynchronizationRate(x, y);

      this.pairProvider.add(({
        id: uuid(),
        entry1: entry1,
        entry2: entry2,
        synchronizationRate: r,
        date: Date.now()
      } as Pair));
    });

    this.pairProvider.save();
  }

  deletePairs() {
    this.pairProvider.Pairs.concat().forEach(p => this.pairProvider.delete(p));
    this.pairProvider.save();
  }
}


