import { client } from '../endpoints';
import { Auth } from '../common';
import { ClientServer, LoginResponse } from './structs';
import { HttpRest } from '../http/rest';
import { HttpSession } from '../http/session';
import transformer from '../transformer';

export interface ClientOptions {
    key?:           string;
    cache?:         boolean;
    session?:{
        username:   string;
        password:   string;
    }
    ws?:            boolean;
}

export class ClientController {
    public auth: Auth;
    public cache:{
        servers?: Map<string, ClientServer>;
    };
    public restMode: boolean;
    private session:{
        username?: string;
        password?: string;
        token?: string;
        expires: number;
    };

    constructor(domain: string, options: ClientOptions) {
        this.auth = { domain, key: options.key };
        this.cache = {};
        if (options.cache) {
            this.cache.servers = new Map<string, ClientServer>();
        }
        this.restMode = !!options.key;
        this.session = {
            ...options.session,
            expires: 0
        };
    }

    private async getHttp(): Promise<typeof HttpRest | typeof HttpSession> {
        if (this.restMode) return HttpRest;
        if (Date.now() > this.session.expires) {
            this.session = await HttpSession.getXsrfToken(this.auth.domain);
            this.auth.key = this.session.token;
        }

        return HttpSession;
    }

    async login(
        credentials?:{
            username: string;
            password: string;
        }
    ): Promise<void> {
        if (this.restMode) throw new Error(
            'Login endpoint is only available with session mode.'
        );
        if (credentials) this.session = Object.assign(this.session, credentials);
        if (!this.session.username || !this.session.password)
            throw new Error('Username/email and password is required for login.');

        const req = await this.getHttp();
        const data = await req.post<LoginResponse>(
            client.auth.login(),
            this.auth,
            transformer.intoJSON({
                user: this.session.username,
                password: this.session.password
            })
        );
        console.log(data);
    }

    // async getServers(
    //     id?: string,
    //     force: boolean = false
    // ): Promise<ClientServer | ClientServer[]> {
    //     if (id && !force && this.cache.servers) {
    //         const s = this.cache.servers.get(id);
    //         if (s) return Promise.resolve(s);
    //     }
    //     const req = await this.getHttp();
    //     const data = await req.get<ClientServer>(
    //         id ? client.servers.get(id) : client.servers.main(),
    //         this.auth
    //     );
    //     const res = id
    //         ? transformer.fromAttributes<ClientServer>(data.attributes)
    //         : transformer.fromData<ClientServer>(data.data);

    //     if (this.cache.servers) {
    //         Array.isArray(res)
    //             ? res.forEach(s => this.cache.servers.set(s.identifier, s))
    //             : this.cache.servers.set(res.identifier, res);
    //     }
    //     return res;
    // }
}

export function createClient(
    domain: string,
    options: ClientOptions = {}
) {
    return new ClientController(domain, options);
}
