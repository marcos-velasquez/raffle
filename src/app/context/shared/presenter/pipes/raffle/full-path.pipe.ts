import { Pipe, PipeTransform } from '@angular/core';
import { FullPathPipe } from '@shared/presenter';
import { Raffle, Voucher } from '@context/shared/domain';
@Pipe({ name: 'fullPath' })
export class VoucherFullPathPipe implements PipeTransform {
  transform(voucher: Voucher): string {
    return new FullPathPipe().transform('vouchers', voucher.getId(), voucher.toString());
  }
}

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
