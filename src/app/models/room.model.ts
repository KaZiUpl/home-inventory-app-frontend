export class RoomSimpleOutput {
  _id: string;
  name: string;
  description: string;
  house: string;
}

export class RoomFullOutput {
  _id: string;
  name: string;
  description: string;
  house: { _id: string; name: string };
  storage: any[]; // TODO: add storage items
}

export class RoomUpdateInput {
  name: string;
  description?: string;
}

export class RoomInput {
  name: string;
  description?: string;
}
