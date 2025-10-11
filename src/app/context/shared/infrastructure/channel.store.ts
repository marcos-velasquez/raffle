import { inject } from '@angular/core';
import { signalStore, withState, patchState, withMethods, withHooks, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Channel, Currency } from '../domain';
import { PocketbaseChannelRepository } from './channel.repository';

type ChannelState = {
  channels: Channel[];
  selected: Channel;
};

const initialState: ChannelState = {
  channels: [],
  selected: Channel.empty(),
};

export const ChannelStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks((store, repository = inject(PocketbaseChannelRepository)) => ({
    onInit() {
      repository.findAll().then((result) => {
        result.mapRight((channels) => patchState(store, { channels, selected: channels[0] }));
      });
      repository.valuesChange().subscribe((channels) => patchState(store, { channels }));
    },
  })),
  withComputed((store) => ({
    uniques: computed(() =>
      store.channels().filter((channel, index, arr) => arr.findIndex((c) => c.currency === channel.currency) === index)
    ),
    currencies: computed(() => [...new Set(store.channels().map((channel) => channel.currency))]),
  })),
  withMethods((store) => ({
    byCurrencies(currencies: Currency[]) {
      return store.channels().filter((channel) => currencies.includes(channel.currency as Currency));
    },
    insert(channel: Channel) {
      patchState(store, (state) => ({ channels: [...state.channels, channel] }));
    },
    remove(channel: Channel) {
      patchState(store, (state) => ({
        channels: state.channels.filter((c) => c.getId() !== channel.getId()),
      }));
    },
    update(channel: Channel) {
      patchState(store, (state) => ({
        channels: state.channels.map((c) => (c.getId() === channel.getId() ? channel : c)),
      }));
    },
    select(channel: Channel) {
      patchState(store, { selected: channel });
    },
  }))
);
