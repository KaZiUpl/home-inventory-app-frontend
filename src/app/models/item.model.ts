import { UserSimpleOutput } from './user.model';

export class ItemSimpleOutput {
  _id: string;
  name: string;
  description: string;
  owner: string;
}

export class ItemFullOutput {
  _id: string;
  name: string;
  description: string;
  owner: UserSimpleOutput;
}

export class ItemInput {
  name: string;
  description?: string;
  manufacturer?: string;
}
