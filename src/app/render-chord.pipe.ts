import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'renderChord'
})
export class RenderChordPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
