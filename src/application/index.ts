import { application as app } from '../endpoints';
import {
    AppServer,
    CreateServerOptions,
    CreateUserOptions,
    Node,
    PteroUser,
    UpdateBuildOptions,
    UpdateDetailsOptions,
    UpdateStartupOptions
} from './structs';
import http, { Auth } from '../http/rest';
import transfomer from '../transformer';

export interface AppCacheOptions {
    cache?: boolean;
}

export class AppController {
    public auth: Auth;
    public cache:{
        allocations?: Map<number, object>;
        nodes?: Map<number, Node>;
        servers?: Map<number, AppServer>;
        users?: Map<number, PteroUser>;
    };

    constructor(domain: string, key: string, options: AppCacheOptions) {
        this.auth = { domain, key };
        this.cache = {};

        if (options.cache) {
            this.cache.allocations = new Map<number, object>();
            this.cache.nodes = new Map<number, Node>();
            this.cache.servers = new Map<number, AppServer>();
            this.cache.users = new Map<number, PteroUser>();
        }
    }

    async getServers(id?: number): Promise<AppServer | AppServer[]> {
        const data = await http.get<AppServer>(
            id ? app.servers.get(id) : app.servers.main(),
            this.auth
        );
        const res = id
            ? transfomer.fromAttributes<AppServer>(data.attributes)
            : transfomer.fromData<AppServer>(data.data);

        if (this.cache.servers) {
            Array.isArray(res)
                ? res.forEach(s => this.cache.servers.set(s.id, s))
                : this.cache.servers.set(res.id, res);
        }
        return res;
    }

    async createServer(options: CreateServerOptions): Promise<AppServer> {
        const data = await http.post<AppServer>(
            app.servers.main(),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<AppServer>(data.attributes);
        this.cache.servers?.set(res.id, res);
        return res;
    }

    async updateServerBuild(
        id: number,
        options: UpdateBuildOptions
    ): Promise<AppServer> {
        const data = await http.patch<AppServer>(
            app.servers.build(id),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<AppServer>(data.attributes);
        this.cache.servers?.set(res.id, res);
        return res;
    }

    async updateServerDetails(
        id: number,
        options: UpdateDetailsOptions
    ): Promise<AppServer> {
        const data = await http.patch<AppServer>(
            app.servers.details(id),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<AppServer>(data.attributes);
        this.cache.servers?.set(res.id, res);
        return res;
    }

    async updateServerStartup(
        id: number,
        options: UpdateStartupOptions
    ): Promise<AppServer> {
        const data = await http.patch<AppServer>(
            app.servers.startup(id),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<AppServer>(data.attributes);
        this.cache.servers?.set(res.id, res);
        return res;
    }

    async suspendServer(id: number): Promise<void> {
        await http.post(app.servers.suspend(id), this.auth);
    }

    async unsuspendServer(id: number): Promise<void> {
        await http.post(app.servers.unsuspend(id), this.auth);
    }

    async getUsers(
        id?: number,
        force: boolean = false
    ): Promise<PteroUser | PteroUser[]> {
        const data = await http.get<PteroUser>(
            id ? app.users.get(id) : app.users.main(),
            this.auth
        );
        const res = id
            ? transfomer.fromAttributes<PteroUser>(data.attributes)
            : transfomer.fromData<PteroUser>(data.data);

        if (this.cache.users) {
            Array.isArray(res)
                ? res.forEach(s => this.cache.users.set(s.id, s))
                : this.cache.users.set(res.id, res);
        }
        return res;
    }

    async createUser(options: CreateUserOptions): Promise<PteroUser> {
        const data = await http.post<PteroUser>(
            app.users.main(),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<PteroUser>(data.attributes);
        this.cache.users?.set(res.id, res);
        return res;
    }

    async updateUser(
        id: number,
        options: Partial<CreateUserOptions>
    ): Promise<PteroUser> {
        if (!Object.keys(options).length)
            throw new Error('Not enough options to update the user.');

        const user = await this.getUsers(id);
        const data = await http.patch<PteroUser>(
            app.users.get(id),
            this.auth,
            transfomer.intoJSON(Object.assign(user, options))
        );
        const res = transfomer.fromAttributes<PteroUser>(data.attributes);
        this.cache.users?.set(res.id, res);
        return res;
    }

    async deleteUser(id: number): Promise<void> {
        await http.delete(app.users.get(id), this.auth);
        this.cache.users?.delete(id);
    }
}

export function createApp(
    domain: string,
    auth: string,
    options: AppCacheOptions = {}
) {
    return new AppController(domain, auth, options);
}
