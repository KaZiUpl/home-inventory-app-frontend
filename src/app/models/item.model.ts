import { SafeUrl } from '@angular/platform-browser';
import { UserSimpleOutput } from './user.model';

export class ItemSimpleOutput {
  _id: string;
  name: string;
  description?: string;
  manufacturer?: string;
  ean?: string;
  photo?: string;
  photoSafe?: SafeUrl;
}

export class ItemFullOutput {
  _id: string;
  name: string;
  owner: UserSimpleOutput;
  description?: string;
  manufacturer?: string;
  ean?: string;
  photo?: string;
  photoSafe?: SafeUrl;
}

export class ItemInput {
  name: string;
  description?: string;
  manufacturer?: string;
  ean?: string;
}
