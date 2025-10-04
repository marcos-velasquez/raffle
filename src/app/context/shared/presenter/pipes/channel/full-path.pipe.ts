import { Pipe, PipeTransform } from '@angular/core';
import { FullPathPipe } from '@shared/presenter';
import { Channel } from '@context/shared/domain';

@Pipe({ name: 'fullPath' })
export class ChannelFullPathPipe implements PipeTransform {
  transform(channel: Channel): string {
    return new FullPathPipe().transform('channel', channel.getId(), channel.image);
  }
}
