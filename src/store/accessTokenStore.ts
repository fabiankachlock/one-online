export interface AccessTokenStore {
  storeToken: (token: string, gameId: string) => void;
  useToken: (token: string) => string;
  deleteToken: (token: string) => void;
  deleteTokensForGame: (gameId: string) => void;
  all: () => { token: string; gameId: string }[];
}
