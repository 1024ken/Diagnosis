import { Item } from './item';
import { Entry } from './entry';

export class Pair extends Item {
  public entry1: Entry;
  public entry2: Entry;
  public synchronizationRate: number;
  public date: number;

  constructor() {
    super();
    this.entry1 = null;
    this.entry2 = null;
    this.synchronizationRate = 0;
    this.date = null;
  }
}
