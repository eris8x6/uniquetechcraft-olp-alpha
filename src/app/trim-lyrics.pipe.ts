import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimLyrics'
})
export class TrimLyricsPipe implements PipeTransform {

  transform(value: String): String {
    return value.replace(/\^/g, '');
  }

}
