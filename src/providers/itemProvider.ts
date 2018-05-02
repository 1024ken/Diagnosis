import { Storage } from '@ionic/storage';

import { Item } from '../models/item';

export abstract class ItemProvider {
  protected items: Item[];

  constructor(protected storage:Storage) {
    this.items = [];
  }

  protected abstract getSaveKey(): string;
  protected abstract sortItems(): void;

  get Items(): Item[] {
    return this.items;
  }

  get(id: string): Item {
    return this.items.find(e => e.id == id);
  }

  add(item: Item): ItemProvider {
    this.items.push(item);
    this.sortItems();
    return this;
  }

  delete(item: Item): ItemProvider {
    let index = this.items.findIndex(e => e.id == item.id);
    if (index < 0) {
      return this;
    }
    this.items.splice(index, 1);
    return this;
  }

  load(): Promise<Item[]> {
    return this.storage.get(this.getSaveKey()).then((items)=>{
      if (items) {
        this.items = items;
        this.sortItems();
      }
      console.log("load " + this.constructor.name, this.items)
      return this.items;
    })
  }

  save(): Promise<Item[]> {
    return this.storage.set(this.getSaveKey(), this.items).then(()=> {
      console.log("save " + this.constructor.name, this.items)
      return this.items;
    });
  }
}
