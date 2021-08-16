import { IResolverObject } from 'apollo-server-express';
import path, { join } from 'path';

import { SubscriptionEvents } from '../constants';
import { fileExists, getHome, isChild, ls } from '../controllers';
import { getCwd, metaSearch, setCwd } from '../datasource';
import { TContext } from '../types';

const Query: IResolverObject = {
  getCwd: () => ({
    cwd: getCwd(),
    children: ls(getCwd()),
  }),
};

const Mutation: IResolverObject<any, TContext, any> = {
  cd: (_, { dir }, { pubsub }) => {
    if (dir && isChild(dir, getCwd()))
      setCwd(join(getCwd(), dir));
    else if (dir.startsWith('C:') && fileExists(dir)) setCwd(dir);
    else setCwd(getHome());
    const newCwd = {
      cwd: getCwd(),
      children: ls(getCwd()),
    };
    pubsub.publish(SubscriptionEvents.NEW_CWD, { newCwd });
    return newCwd;
  },
  metaSearch: (_, { files }, { pubsub }) => {
    const total = files.length;
    let progress = 0;
    const cwd = getCwd();
    (files as string[]).forEach((file) => {
      metaSearch(join(cwd, file), (res, err) => {
        if (err) throw err;
        progress++;
        pubsub.publish(SubscriptionEvents.META_SEARCH, {
          newSearchResult: {
            file,
            matches: res.metadata.music.map((meta) => ({
              title: meta?.title || '',
              artist: meta?.artists?.map(artist => artist.name).reduce((store, state) => store + ', ' + state) || '',
              album: meta?.album?.name || '',
              year: new Date(meta?.release_date)?.getFullYear() || '',
              albumArtist: meta?.artists[0]?.name || '',
              genre: meta?.genres?.map(genre => genre.name).reduce((store, state) => store + ', ' + state) || '',
              disk: 0,
              track: 0
            })),
            progress,
            total
          }
        })
      });
    })
    return 'Searching';
  }
};

const Subscription: IResolverObject<any, TContext, any> = {
  newSearchResult: {
    subscribe: (_, __, { pubsub }) =>
      pubsub.asyncIterator(SubscriptionEvents.META_SEARCH),
  },
  newCwd: {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(SubscriptionEvents.NEW_CWD)
  }
};

const Dirent: IResolverObject = {
  __resolveType: (par) => {
    return par.size ? 'File' : 'Directory';
  },
};

export default { Query, Mutation, Dirent, Subscription };
