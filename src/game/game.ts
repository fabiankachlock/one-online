import { v4 as uuid } from 'uuid'
import { GameStateManager } from './state/state.js';
import { GameStoreRef } from './interface.js';
import { GameOptions } from './options.js';
import { GameNotificationManager } from './notificationManager';
import { createRef } from '../store/gameStoreRef.js';

export type GameMeta = {
    playerCount: number;
    running: boolean;
    players: Set<string>
    playerLinks: {
        [id: string]: {
            left: string;
            right: string;
        };
    }
}

export class Game {

    private metaData: GameMeta
    private storeRef: GameStoreRef
    private notificationManager: GameNotificationManager
    private stateManager: GameStateManager | undefined

    private constructor(
        public readonly name: string,
        private readonly password: string,
        public readonly host: string,
        public readonly isPublic: boolean,
        public readonly key: string = uuid(),
        public readonly options: GameOptions = GameOptions.default(),
    ) {
        this.metaData = {
            playerCount: 1,
            players: new Set(),
            running: false,
            playerLinks: {}
        }
        this.metaData.players.add(host)
        this.storeRef = createRef(this)
        this.storeRef.save()
        this.notificationManager = new GameNotificationManager(this.key)
    }

    get meta() {
        return this.metaData
    }

    public isReady = (playerAmount: number) => this.metaData.playerCount === playerAmount

    static create = (
        name: string,
        password: string,
        host: string,
        isPublic: boolean,
    ): Game => new Game(name, isPublic ? '' : password, host, isPublic)

    public join = (playerId: string, name: string, password: string): boolean => {
        if (!this.isPublic && (password !== this.password || !this.storeRef.checkPlayer(playerId, name))) return false

        this.metaData.playerCount += 1
        this.metaData.players.add(playerId)

        this.notificationManager.notifyPlayerChange(this.storeRef.queryPlayers())

        this.storeRef.save()
        return true;
    }

    public joinedWaiting = () => {
        this.notificationManager.notifyPlayerChange(this.storeRef.queryPlayers())
    }

    public leave = (playerId: string, name: string) => {
        if (!this.storeRef.checkPlayer(playerId, name)) return

        this.metaData.players.delete(playerId)
        this.metaData.playerCount -= 1

        this.notificationManager.notifyPlayerChange(this.storeRef.queryPlayers())

        if (this.metaData.playerCount <= 0) {
            this.notificationManager.notifyGameStop()
            this.storeRef.destroy()
            return
        }

        this.storeRef.save()
    }

    public verify = (playerId: string): boolean => this.metaData.players.has(playerId)

    public prepare = () => {

        this.constructPlayerLinks()

        if (this.stateManager) {
            this.stateManager.clear()
            this.stateManager = undefined
        }

        this.stateManager = new GameStateManager(this.key, this.meta, this.options.all)
        this.stateManager.prepare()

        this.metaData.running = true;
        this.storeRef.save()
    }

    public start = () => {
        this.notificationManager.notifyGameStart()
        this.stateManager?.start();
    }

    public stop = () => {
        this.notificationManager.notifyGameStop()
        this.storeRef.destroy()
    }

    private constructPlayerLinks = () => {
        const players = Array.from(this.metaData.players)
        this.metaData.playerLinks = {}

        players.forEach((p, index) => {
            let leftLink: string;
            if (index < players.length - 1) {
                leftLink = players[index + 1]
            } else {
                leftLink = players[0]
            }

            let rightLink: string;
            if (index > 0) {
                rightLink = players[index - 1]
            } else {
                rightLink = players[players.length - 1]
            }

            this.metaData.playerLinks[p] = {
                left: leftLink,
                right: rightLink
            }
        })
    }

    public eventHandler = () => (msg: string) => {
        console.log('[Game]', this.key, ' incoming event: ', msg)
        this.stateManager?.handleEvent(JSON.parse(msg))
    }

}