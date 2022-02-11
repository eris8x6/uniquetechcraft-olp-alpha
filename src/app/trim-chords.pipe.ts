import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimChords'
})
export class TrimChordsPipe implements PipeTransform {

  transform(value: String): String {
    return value.replace(/X/g, ' ').replace(/P/g, ' ').replace(/\|/g, '').replace(/\//g, ' / ');
  }

}
