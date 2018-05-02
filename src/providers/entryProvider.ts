import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ItemProvider } from './itemProvider';
import { Entry } from '../models/entry';

@Injectable()
export class EntryProvider extends ItemProvider {
  private readonly ENTRY_ITEMS_KEY: string = 'entry_items';

  constructor(protected storage:Storage) {
    super(storage);
  }

  get User(): Entry {
    return (this.items as Entry[]).find(e => e.isUser);
  }

  get Others(): Entry[] {
    return (this.items as Entry[]).filter(e => !e.isUser).sort((a, b) => {
        return a.nickname.localeCompare(b.nickname);
      });
  }

  get Entries(): Entry[] {
    return this.items as Entry[];
  }

  protected getSaveKey(): string {
    return this.ENTRY_ITEMS_KEY;
  }

  protected sortItems(): void {
    (this.items as Entry[]).sort((a, b) => {
      if (a.isUser) return -1;
      if (b.isUser) return 1;
      return a.nickname.localeCompare(b.nickname);
    });
  }
}