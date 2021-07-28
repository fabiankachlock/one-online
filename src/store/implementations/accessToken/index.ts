import { AccessTokenStore } from '../../accessTokenStore.js';
import { AccessTokenMemoryStore } from './accessTokenMemoryStore.js';

export const TokenStore: AccessTokenStore = AccessTokenMemoryStore;
