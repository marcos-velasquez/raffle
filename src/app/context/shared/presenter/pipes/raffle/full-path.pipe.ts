import { Pipe, PipeTransform } from '@angular/core';
import { FullPathPipe } from '@shared/infrastructure';
import { Raffle } from '@context/shared/domain/raffle';

@Pipe({ name: 'fullPath' })
export class RaffleFullPathPipe implements PipeTransform {
  transform(raffle: Raffle, url: string): string {
    return new FullPathPipe().transform('raffles', raffle.getId(), url);
  }
}

@Pipe({ name: 'fullPaths' })
export class RaffleFullPathsPipe implements PipeTransform {
  transform(raffle: Raffle): string[] {
    return raffle.images.map((url) => new RaffleFullPathPipe().transform(raffle, url));
  }
}
