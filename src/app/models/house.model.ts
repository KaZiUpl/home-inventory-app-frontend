import { RoomSimpleOutput } from './room.model';
import { UserSimpleOutput } from './user.model';

export class HouseSimpleOutput {
  _id: string;
  name: string;
  description: string;
  owner: UserSimpleOutput;
  collaborators?: string[];
  rooms?: string[];
}

export class HouseFullOutput {
  _id: string;
  name: string;
  description: string;
  owner: UserSimpleOutput;
  collaborators?: UserSimpleOutput[];
  rooms?: RoomSimpleOutput[];
}

export class HouseUpdateInput {
  name: string;
  description: string;
}
