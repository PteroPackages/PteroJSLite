import { application as app } from '../endpoints';
import {
    Allocation,
    AppServer,
    CreateServerOptions,
    CreateUserOptions,
    Node,
    User,
    UpdateBuildOptions,
    UpdateDetailsOptions,
    UpdateStartupOptions
} from './structs';
import { Http } from '../http';
import { Auth } from '../common';
import transfomer from '../transformer';

export interface AppOptions {
    cache?: boolean;
}

export class AppController {
    public auth: Auth;
    public cache:{
        allocations?: Map<number, Allocation>;
        nodes?: Map<number, Node>;
        servers?: Map<number, AppServer>;
        users?: Map<number, User>;
    };

    constructor(domain: string, key: string, options: AppOptions) {
        this.auth = { domain, key };
        this.cache = {};

        if (options.cache) {
            this.cache.allocations = new Map<number, Allocation>();
            this.cache.nodes = new Map<number, Node>();
            this.cache.servers = new Map<number, AppServer>();
            this.cache.users = new Map<number, User>();
        }
    }

    async getServers(id?: number): Promise<AppServer | AppServer[]> {
        const data = await Http.get(
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
        const data = await Http.post(
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
        const data = await Http.patch(
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
        const data = await Http.patch(
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
        const data = await Http.patch(
            app.servers.startup(id),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<AppServer>(data.attributes);
        this.cache.servers?.set(res.id, res);
        return res;
    }

    async suspendServer(id: number): Promise<void> {
        await Http.post(app.servers.suspend(id), this.auth);
    }

    async unsuspendServer(id: number): Promise<void> {
        await Http.post(app.servers.unsuspend(id), this.auth);
    }

    async getUsers(
        id?: number,
        force: boolean = false
    ): Promise<User | User[]> {
        if (!force && this.cache.users?.has(id))
            return this.cache.users!.get(id);

        const data = await Http.get(
            id ? app.users.get(id) : app.users.main(),
            this.auth
        );
        const res = id
            ? transfomer.fromAttributes<User>(data.attributes)
            : transfomer.fromData<User>(data.data);

        if (this.cache.users) {
            Array.isArray(res)
                ? res.forEach(s => this.cache.users.set(s.id, s))
                : this.cache.users.set(res.id, res);
        }
        return res;
    }

    async createUser(options: CreateUserOptions): Promise<User> {
        const data = await Http.post(
            app.users.main(),
            this.auth,
            transfomer.intoJSON(options)
        );
        const res = transfomer.fromAttributes<User>(data.attributes);
        this.cache.users?.set(res.id, res);
        return res;
    }

    async updateUser(
        id: number,
        options: Partial<CreateUserOptions>
    ): Promise<User> {
        if (!Object.keys(options).length)
            throw new Error('Not enough options to update the user.');

        const user = await this.getUsers(id);
        const data = await Http.patch(
            app.users.get(id),
            this.auth,
            transfomer.intoJSON(Object.assign(user, options))
        );
        const res = transfomer.fromAttributes<User>(data.attributes);
        this.cache.users?.set(res.id, res);
        return res;
    }

    async deleteUser(id: number): Promise<void> {
        await Http._delete(app.users.get(id), this.auth);
        this.cache.users?.delete(id);
    }

    async getNodes(id?: number, force: boolean = false): Promise<Node | Node[]> {
        if (id && !force && this.cache.nodes?.has(id))
            return this.cache.nodes!.get(id);

        const data = await Http.get(
            id ? app.users.get(id) : app.users.main(),
            this.auth
        );
        const res = id
            ? transfomer.fromAttributes<Node>(data.attributes)
            : transfomer.fromData<Node>(data.data);

        if (this.cache.nodes) {
            Array.isArray(res)
                ? res.forEach(s => this.cache.nodes.set(s.id, s))
                : this.cache.nodes.set(res.id, res);
        }
        return res;
    }

    async getAllocations(node: number): Promise<Allocation[]> {
        const data = await Http.get(app.allocations.main(node), this.auth);
        return transfomer.fromData(data.data);
    }

    async getAvailableAllocations(node: number): Promise<Allocation[]> {
        const data = await this.getAllocations(node);
        return data.filter(a => !a.assigned);
    }

    async createAllocation(
        node: number,
        ip: string,
        ports: string[]
    ): Promise<void> {
        for (const port of ports) {
            if (!port.includes('-')) continue;
            let [_start, _stop] = port.split('-');
            let start = Number(_start), stop = Number(_stop);
            if (start > stop) throw new RangeError('Start cannot be greater than stop.');
            if (start <= 1024 || stop > 65535)
                throw new RangeError('Port range must be between 1024 and 65535.');

            if (stop - start > 1000)
                throw new RangeError('Maximum port range exceeded (1000).');
        }

        await Http.post(app.allocations.main(node), this.auth, { ip, ports });
    }

    async deleteAllocation(node: number, id: number): Promise<void> {
        await Http._delete(app.allocations.get(node, id), this.auth);
    }
}

export function createApp(
    domain: string,
    auth: string,
    options: AppOptions = {}
) {
    return new AppController(domain, auth, options);
}
