import { MessageEvent, WebSocket } from 'ws';
import {
    PowerSignal,
    Resources,
    WebSocketAuth,
    WebSocketPayload,
} from './client/types';
import { Auth } from './common';
import conv from './conversions';
import http from './http';

export interface IShard {
    connect(): Promise<void>;
    _heartbeat(): Promise<void>;
    destroy(): void;
    onDebug?: (data: any) => void;
    onRaw?: (payload: WebSocketPayload) => void;
    onError?: (error: Error) => void;
    onReady?: () => void;
    onBackupComplete?: (backup: any) => void;
    onConsoleOutput?: (out: string[]) => void;
    onDaemonOutput?: (out: string[]) => void;
    onDaemonError?: (err: Error) => void;
    onInstallStart?: () => void;
    onInstallOutput?: (out: string[]) => void;
    onInstallComplete?: () => void;
    onJWTError?: (err: Error) => void;
    onStatsUpdate?: (stats: Resources) => void;
    onStatusUpdate?: (status: string) => void;
    onTransferOutput?: (out: string[]) => void;
    onTransferStatus?: (status: string) => void;
    requestLogs(): void;
    requestStats(): void;
    sendCommand(command: string): void;
    setPowerState(signal: PowerSignal): void;
}

export type Shard = IShard &
    ThisType<{ auth: Auth; id: string; ws: WebSocket | null }>;

export function createShard(id: string, auth: Auth): Shard {
    const impl = <IShard>{
        async connect() {
            const auth = await http.get<{ data: WebSocketAuth }>(
                `/api/client/servers/${this.id}/websocket`,
                this.auth
            );
            this.ws = new WebSocket(auth.data.socket, {
                origin: this.auth.url,
            });

            this.ws.on('open', () => {
                this.onDebug?.(`authenticating shard ${this.id}`);
                this.ws.send(
                    JSON.stringify({ event: 'auth', args: [auth.data.token] })
                );
            });

            this.ws.on('message', (m: MessageEvent) => {
                const packet = JSON.parse(m.toString()) as WebSocketPayload;
                this.onRaw?.(packet);

                switch (packet.event) {
                    case 'auth success':
                        this.onReady?.();
                        break;
                    case 'token expiring':
                        this._heartbeat();
                        break;
                    case 'token expired':
                        this.disconnect();
                        break;
                    case 'backup completed':
                        this.onBackupComplete?.(JSON.parse(packet.args.join()));
                        break;
                    case 'console output':
                        this.onConsoleOutput?.(packet.args);
                        break;
                    case 'daemon message':
                        this.onDaemonOutput?.(packet.args);
                        break;
                    case 'daemon error':
                        this.onDaemonError?.(new Error(packet.args.join()));
                        break;
                    case 'install started':
                        this.onInstallStart?.();
                        break;
                    case 'install output':
                        this.onInstallOutput?.(packet.args);
                        break;
                    case 'install completed':
                        this.onInstallComplete?.();
                        break;
                    case 'jwt error':
                        this.onJWTError?.(new Error(packet.args.join()));
                        break;
                    case 'stats':
                        this.onStatsUpdate?.(
                            conv.toCamelCase(JSON.parse(packet.args.join()))
                        );
                        break;
                    case 'status':
                        this.onStatusUpdate?.(packet.args.join());
                        break;
                    case 'transfer logs':
                        this.onTransferOutput?.(packet.args);
                        break;
                    case 'transfer status':
                        this.onTransferStatus?.(packet.args[0]);
                        break;
                    default:
                        this.onError?.(
                            `received unknown event '${packet.event}'`
                        );
                        break;
                }
            });

            this.ws.on('error', (e: Error) => this.onError?.(e));
            this.ws.on('close', () => (this.ws = null));
        },

        async _heartbeat() {
            this.onDebug?.(`reauthenticating shard ${this.id}`);
            const auth = await http.get<{ data: WebSocketAuth }>(
                `/api/client/servers/${this.id}/websocket`,
                this.auth
            );
            this.ws?.send(
                JSON.stringify({ event: 'auth', args: [auth.data.token] })
            );
        },

        destroy() {
            this.ws?.close(1000);
            this.ws = null;
        },

        requestLogs() {
            this.ws?.send(JSON.stringify({ event: 'send logs', args: [] }));
        },

        requestStats() {
            this.ws?.send(JSON.stringify({ event: 'send stats', args: [] }));
        },

        sendCommand(command) {
            this.ws?.send(
                JSON.stringify({ event: 'send command', args: [command] })
            );
        },

        setPowerState(signal) {
            this.ws?.send(
                JSON.stringify({ event: 'set state', args: [signal] })
            );
        },
    };

    return <Shard>{
        auth,
        id,
        ws: null,
        ...impl,
    };
}
