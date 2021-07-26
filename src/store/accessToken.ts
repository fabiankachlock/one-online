import { TokenStore } from './implementations/accessToken/index'
import { v4 as uuid } from 'uuid'

export const createAccessToken = (forGame: string): string => {
    const token = (uuid() + uuid()).replace('-', '')
    TokenStore.storeToken(token, forGame)
    return token
}

export const useAccessToken = (token: string): string | undefined => {
    const gameId = TokenStore.useToken(token)

    return gameId.length === 0 ? undefined : gameId
}
