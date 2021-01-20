import { ItemSimpleOutput } from './item.model';

export class StorageItemFullOutput {
  _id: string;
  item: ItemSimpleOutput;
  quantity: number;
  expiration?: string;

  description?: string;
  room?: { _id: string; name: string };
  house?: { _id: string; name: string };
}

export class StorageItemUpdateInput {
  quantity: number;
  expiration: number;
  description: string;
}

export class StorageItemInput {
  item: string;
  quantity: number;
  description?: string;
  expiration?: number;
}
