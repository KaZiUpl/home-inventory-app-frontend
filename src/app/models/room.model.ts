import { ItemSimpleOutput } from './item.model';

export class RoomSimpleOutput {
  _id: string;
  name: string;
  description: string;
  house: string;
  storage: StorageItemFullOutput[];
}

export class RoomFullOutput {
  _id: string;
  name: string;
  description: string;
  house: { _id: string; name: string };
  storage: StorageItemFullOutput[];
}

export class StorageItemSimpleOutput {
  _id: string;
  item: string;
  quantity: number;
  expiration: string;
  description: string;
}

export class StorageItemFullOutput {
  _id: string;
  item: ItemSimpleOutput;
  expiration: string;
  quantity: number;
  description: string;
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

export class RoomUpdateInput {
  name: string;
  description?: string;
}

export class RoomInput {
  name: string;
  description?: string;
}
