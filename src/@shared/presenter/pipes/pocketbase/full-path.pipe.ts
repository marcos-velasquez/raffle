import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({ name: 'fullPath' })
export class FullPathPipe implements PipeTransform {
  transform(collection: string, id: string, url: string): string {
    return `${environment.POCKETBASE_URL}/api/files/${collection}/${id}/${url}`;
  }
}
