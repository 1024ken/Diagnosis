import { v4 as uuid } from 'uuid';

export abstract class Item {
  public id: string;

  constructor() {
    this.id = uuid();
  }
}