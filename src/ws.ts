import { MessageEvent, WebSocket } from 'ws';
import { WebSocketAuth } from './client/types';
import { Auth } from './common';
// import conv from './conversions';
import http from './http';

export interface IShard {
    connect(): Promise<void>;
    onDebug?: (data: any) => void;
    onRaw?: (payload: string) => void;
    onError?: (error: Error) => void;
}

export type Shard = IShard & ThisType<{ auth: Auth, id: string, ws: WebSocket | null }>;

export function createShard(id: string, auth: Auth): Shard {
    const impl = <IShard>{
        async connect() {
            const auth = await http.get<{ data: WebSocketAuth }>(`/api/client/servers/${this.id}/websocket`, this.auth);
            this.ws = new WebSocket(auth.data.socket, { origin: this.auth.url });

            this.ws.on('open', () => {
                this.onDebug?.(`authenticating shard ${this.id}`);
                this.ws.send(JSON.stringify({ event: 'auth', args:[auth.data.token] }));
            });

            this.ws.on('message', (m: MessageEvent) => {
                const packet = JSON.parse(m.toString());
                this.onRaw?.(packet);
            });

            this.ws.on('error', (e: Error) => this.onError?.(e));
            this.ws.on('close', () => this.ws = null);
        }
    };

    return <Shard>{
        auth,
        id,
        ws: null,
        ...impl
    };
}