//
// * Config types
//

type _initialConfig = {
  popVolume: number;
} & RemoteConfig;

export const initalConfig: _initialConfig = {
  // Local config
  popVolume: 70,

  // Remote config -> can be overriden by the remote
  badge: {
    color: '#26282b',
    backgroundColor: '#7aa5eb',
  },
  spawnInterval: {
    min: 1000,
    max: 10 * 60000,
  },
};

//
// * Remote types
//

export type User = {
  id: string;
  username: string;
  email?: string;
  count: number;
  updatedAt: string;
  createdAt: string;
};

export type RemoteConfig = {
  badge: {
    color: hexColor;
    backgroundColor: hexColor;
  };
  spawnInterval: {
    min: number;
    max: number;
  };
};

export type RemoteResponse = {
  user: User;
  count: {
    id: string;
    count: number;
    updatedAt: string;
  };
  status: {
    status: 'up';
    version: string;
  };
  configuration: RemoteConfig;
  leaderboard: {
    user: User;
    rank: number;
    topUsers: User[];
  };
};

export type Endpoint =
  | '/status'
  | '/configuration'
  | '/user/new'
  | '/user/:id'
  | '/user'
  | '/user/count/increment'
  | '/leaderboard';

//
// * Storage types
//

type Config = Prettify<typeof initalConfig & RemoteConfig>;

export type StorageStructure = {
  config: Config;
  token: string;
  user: User;
};

export type storageKey = keyof StorageStructure;

//
// * Chrome message types
//

type UpdateCounterMessage = {
  action: 'updateCounter';
  balloonCount: number;
};

type IncrementCount = {
  action: 'incrementCount';
};

type SpawnBalloonMessage = {
  action: 'spawnBalloon';
};

export type Message =
  | UpdateCounterMessage
  | IncrementCount
  | SpawnBalloonMessage;

//
// * Alarms
//

export type AlarmName = 'spawnBalloon' | 'restart';

//
// * Development
//

const dev_user: User = {
  id: '1',
  username: 'John',
  email: '',
  count: 0,
  updatedAt: '2021-10-10T10:00:00Z',
  createdAt: '2021-10-10T10:00:00Z',
};

export const devRemoteResponse: Record<
  Endpoint,
  RemoteResponse[keyof RemoteResponse]
> = {
  '/status': { status: 'up', version: '1.0.0' },
  '/configuration': initalConfig,
  '/user/new': { token: 'token', user: dev_user } as any,
  '/user/:id': dev_user,
  '/user': dev_user,
  '/user/count/increment': {
    id: dev_user.id,
    count: 1,
    updatedAt: '2021-10-10T10:00:00Z',
  },
  '/leaderboard': {
    user: dev_user,
    rank: 1,
    topUsers: [dev_user],
  },
};

//
// * Other
//

export type hexColor = string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
