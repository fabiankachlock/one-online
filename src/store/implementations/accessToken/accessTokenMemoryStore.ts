import { AccessTokenStore } from '../../accessTokenStore';

const map: Record<string, string> = {}

export const AccessTokenMemoryStore: AccessTokenStore = {
    storeToken: (token, gameId) => map[token] = gameId,
    deleteToken: (token) => delete map[token],
    deleteTokensForGame: (gameId) => Object.entries(map).filter(([, id]) => gameId === id).forEach(([token]) => AccessTokenMemoryStore.deleteToken(token)),
    useToken: (token) => {
        const gameId = map[token]
        AccessTokenMemoryStore.deleteToken(token)
        return gameId || ''
    }
}