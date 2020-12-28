import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutToLength',
})
export class CutToLengthPipe implements PipeTransform {
  transform(value: string, limit: number): any {
    if (value === null) return '';
    if (value.length > limit) {
      return value.slice(0, limit) + '...';
    } else return value;
  }
}
