import { client } from '../endpoints';
import { Auth } from '../common';
import { APIKey, ClientServer, ClientUser } from './structs';
import { HttpRest } from '../http/rest';
import transformer from '../transformer';

export interface ClientOptions {
    key?:   string;
    cache?: boolean;
    ws?:    boolean;
}

export class ClientController {
    public auth: Auth;
    public cache:{
        apikeys?: Map<string, APIKey>;
        servers?: Map<string, ClientServer>;
    };

    constructor(domain: string, options: ClientOptions) {
        this.auth = { domain, key: options.key };
        this.cache = {};
        if (options.cache) {
            this.cache.apikeys = new Map<string, APIKey>();
            this.cache.servers = new Map<string, ClientServer>();
        }
    }

    async getClient(): Promise<ClientUser> {
        const data = await HttpRest.get<ClientUser>(client.account.main(), this.auth);
        return transformer.fromAttributes(data.attributes);
    }

    async getTwoFactorURL(): Promise<string> {
        const data = await HttpRest.get(client.account.tfa(), this.auth);
        return (data.data as any).image_url_data;
    }

    async enableTwoFactor(code: string): Promise<string[]> {
        const data = await HttpRest.post(client.account.tfa(), this.auth, { code });
        return transformer.fromAttributes<string[]>(data.attributes);
    }

    async disableTwoFactor(password: string): Promise<void> {
        await HttpRest._delete(client.account.tfa(), this.auth, { password });
    }

    async updateEmail(email: string, password: string): Promise<void> {
        await HttpRest.put(client.account.email(), this.auth, { email, password });
    }

    async updatePassword(oldPass: string, newPass: string): Promise<void> {
        if (oldPass.toLowerCase() === newPass.toLowerCase()) return Promise.resolve();
        await HttpRest.put(
            client.account.password(),
            this.auth,
            {
                current_password: oldPass,
                password: newPass,
                password_confirmation: newPass
            }
        );
    }

    async getAPIKeys(): Promise<APIKey[]> {
        const data = await HttpRest.get(client.account.apikeys(), this.auth);
        const res = transformer.fromData<APIKey>(data.data);
        res.forEach(k => this.cache.apikeys?.set(k.identifier, k));
        return res;
    }

    async createAPIKey(
        description: string,
        allowedIps: string[] = []
    ): Promise<APIKey> {
        const data = await HttpRest.post<APIKey>(
            client.account.apikeys(),
            this.auth,
            {
                description,
                allowed_ips: allowedIps
            });

        return transformer.fromAttributes(data.attributes);
    }

    async deleteAPIKey(id: string): Promise<void> {
        await HttpRest._delete(client.account.apikeys(id), this.auth);
        this.cache.apikeys?.delete(id);
    }

    async getServers(
        id?: string,
        force: boolean = false
    ): Promise<ClientServer | ClientServer[]> {
        if (id && !force && this.cache.servers) {
            const s = this.cache.servers.get(id);
            if (s) return Promise.resolve(s);
        }

        const data = await HttpRest.get(
            id ? client.servers.get(id) : client.servers.main(),
            this.auth
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
