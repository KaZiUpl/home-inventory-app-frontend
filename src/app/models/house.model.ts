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
  rooms?: any[];
}

export class HouseUpdateInput {
  name: string;
  description: string;
}
