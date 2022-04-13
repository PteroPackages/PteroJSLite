import { client } from '../endpoints';
import { Auth } from '../common';
import { ClientServer } from './structs';
import { HttpRest } from '../http/rest';
import { HttpSession } from '../http/session';
import transformer from '../transformer';

export interface ClientOptions {
    key?:       string;
    cache?:     boolean;
    session?:   boolean;
    ws?:        boolean;
}

export class ClientController {
    public auth: Partial<Auth>;
    public cache:{
        servers?: Map<string, ClientServer>;
    };
    private restMode: boolean;
    private session: { token?: string; expires: number };

    constructor(domain: string, options: ClientOptions) {
        this.auth = { domain };
        this.cache = {};

        if (options.cache) {
            this.cache.servers = new Map<string, ClientServer>();
        }
        this.restMode = options.key && !options.session;
        this.session = { expires: 0 };
    }

    private async getHttp(): Promise<typeof HttpRest | typeof HttpSession> {
        if (this.restMode) return HttpRest;
        if (Date.now() > this.session.expires)
            this.session = await HttpSession.getXsrfToken(this.auth.domain);

        return HttpSession;
    }

    async getServers(
        id?: string,
        force: boolean = false
    ): Promise<ClientServer | ClientServer[]> {
        if (id && !force && this.cache.servers) {
            const s = this.cache.servers.get(id);
            if (s) return Promise.resolve(s);
        }
        const req = await this.getHttp();
        const data = await req.get<ClientServer>(
            id ? client.servers.get(id) : client.servers.main(),
            this.auth as Auth
        );
        const res = id
            ? transformer.fromAttributes<ClientServer>(data.attributes)
            : transformer.fromData<ClientServer>(data.data);

        if (this.cache.servers) {
            Array.isArray(res)
                ? res.forEach(s => this.cache.servers.set(s.identifier, s))
                : this.cache.servers.set(res.identifier, res);
        }
        return res;
    }
}

export function createClient(
    domain: string,
    options: ClientOptions = {}
) {
    return new ClientController(domain, options);
}
