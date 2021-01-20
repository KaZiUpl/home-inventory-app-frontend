import { StorageItemFullOutput } from './storage-item.model';

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

export class RoomUpdateInput {
  name: string;
  description?: string;
}

export class RoomInput {
  name: string;
  description?: string;
}
