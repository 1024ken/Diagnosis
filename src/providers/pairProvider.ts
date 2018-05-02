import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ItemProvider } from './itemProvider';
import { Pair } from '../models/pair';

@Injectable()
export class PairProvider extends ItemProvider {
  private readonly PAIR_ITEMS_KEY: string = 'pair_items';

  constructor(protected storage:Storage) {
    super(storage);
  }

  get Pairs(): Pair[] {
    return this.items as Pair[];
  }

  protected getSaveKey(): string {
    return this.PAIR_ITEMS_KEY;
  }

  protected sortItems(): void {
    (this.items as Pair[]).sort((a, b) => b.date - a.date);
  }
}
