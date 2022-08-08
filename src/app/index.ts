import { Auth, FractalData, FractalItem } from '../common';
import {
    CreateServerOptions,
    CreateUserOptions,
    UpdateBuildOptions,
    UpdateDetailsOptions,
    UpdateStartupOptions,
    UpdateUserOptions
} from './options';
import { application as routes } from '../routes';
import { AppServer, Egg, Nest, Node, NodeConfig, User } from './types';
import conv from '../conversions';
import http from '../http';

class AppController {
    public auth: Auth;

    constructor(domain: string, key: string) {
        this.auth = { domain, key };
    }

    async getUsers(): Promise<User[]>;
    async getUsers(id: number | string): Promise<User>;
    async getUsers(arg: any = null): Promise<any> {
        let path = routes.users.main();
        if (arg) {
            switch (typeof arg) {
                case 'number': path = routes.users.get(arg); break;
                case 'string': path = routes.users.ext(arg); break;
                default: throw new TypeError(`expected number or string; got ${typeof arg}`);
            }

            const data = await http.get<FractalItem<User>>(path, this.auth);
            return conv.toCamelCase(data!.attributes);
        }

        const data = await http.get<FractalData<User>>(path, this.auth);
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async createUser(options: CreateUserOptions): Promise<User> {
        const data = await http.post<FractalItem<User>>(
            routes.users.main(),
            this.auth,
            conv.toSnakeCase(options)
        );
        return conv.toCamelCase(data!.attributes);
    }

    async updateUser(id: number, options: UpdateUserOptions): Promise<User> {
        const data = await http.patch<FractalItem<User>>(
            routes.users.get(id),
            this.auth,
            conv.toSnakeCase(options)
        );
        return conv.toCamelCase(data!.attributes);
    }

    async deleteUser(id: number): Promise<void> {
        return http.delete(routes.users.get(id), this.auth);
    }

    async getServers(): Promise<AppServer[]>;
    async getServers(id: number | string): Promise<AppServer>;
    async getServers(arg: any = null): Promise<any> {
        let path = routes.servers.main();
        if (arg) {
            switch (typeof arg) {
                case 'number': path = routes.servers.get(arg); break;
                case 'string': path = routes.servers.ext(arg); break;
                default: throw new TypeError(
                    `expected number or string; got ${typeof arg}`
                );
            }

            const data = await http.get<FractalItem<AppServer>>(path, this.auth);
            return conv.toCamelCase(data!.attributes, { pass:['environment'] });
        }

        const data = await http.get<FractalData<AppServer>>(path, this.auth);
        return data!.data.map(
            d => conv.toCamelCase(d.attributes, { pass:['environment'] })
        );
    }

    async createServer(options: CreateServerOptions): Promise<AppServer> {
        const data = await http.post<FractalItem<AppServer>>(
            routes.servers.main(),
            this.auth,
            conv.toSnakeCase(options)
        );
        return conv.toCamelCase(data!.attributes);
    }

    async updateServerDetails(
        id: number,
        options: UpdateDetailsOptions
    ): Promise<AppServer> {
        const data = await http.patch<FractalItem<AppServer>>(
            routes.servers.details(id),
            this.auth,
            conv.toSnakeCase(options)
        );
        return conv.toCamelCase(data!.attributes);
    }

    async updateServerBuild(
        id: number,
        options: UpdateBuildOptions
    ): Promise<AppServer> {
        const data = await http.patch<FractalItem<AppServer>>(
            routes.servers.build(id),
            this.auth,
            conv.toSnakeCase(options)
        );
        return conv.toCamelCase(data!.attributes);
    }

    async updateServerStartup(
        id: number,
        options: UpdateStartupOptions
    ): Promise<AppServer> {
        const data = await http.patch<FractalItem<AppServer>>(
            routes.servers.startup(id),
            this.auth,
            conv.toSnakeCase(options)
        );
        return conv.toCamelCase(data!.attributes);
    }

    async suspendServer(id: number): Promise<void> {
        return http.post(routes.servers.suspend(id), this.auth);
    }

    async unsuspendServer(id: number): Promise<void> {
        return http.post(routes.servers.unsuspend(id), this.auth);
    }

    async reinstallServer(id: number): Promise<void> {
        return http.post(routes.servers.reinstall(id), this.auth);
    }

    async deleteServer(id: number, force: boolean = false): Promise<void> {
        if (force) return http.delete(routes.servers.get(id) + '/force', this.auth);
        return http.delete(routes.servers.get(id), this.auth);
    }

    async getNodes(): Promise<Node[]>;
    async getNodes(id: number): Promise<Node>;
    async getNodes(arg: any = null): Promise<any> {
        if (arg) {
            const data = await http.get<FractalItem<Node>>(
                routes.nodes.get(arg), this.auth
            );
            return conv.toCamelCase(data!.attributes);
        }

        const data = await http.get<FractalData<Node>>(
            routes.nodes.main(), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async getNodeConfig(id: number): Promise<NodeConfig> {
        const data = await http.get<NodeConfig>(
            routes.nodes.config(id), this.auth
        );
        return conv.toCamelCase(data!);
    }

    async deleteNode(id: number): Promise<void> {
        return http.delete(routes.nodes.get(id), this.auth);
    }

    async getNests(): Promise<Nest[]>;
    async getNests(id: number): Promise<Nest>;
    async getNests(arg: any = null): Promise<any> {
        if (arg) {
            const data = await http.get<FractalItem<Nest>>(
                routes.nests.get(arg), this.auth
            );
            return conv.toCamelCase(data!.attributes);
        }

        const data = await http.get<FractalData<Nest>>(
            routes.nests.main(), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async getEggs(nest: number): Promise<Egg[]>;
    async getEggs(nest: number, id: number): Promise<Egg>;
    async getEggs(nest: number, arg: any = null): Promise<any> {
        if (arg) {
            const data = await http.get<FractalItem<Egg>>(
                routes.nests.eggs.get(nest, arg), this.auth
            );
            return conv.toCamelCase(data!.attributes);
        }

        const data = await http.get<FractalData<Egg>>(
            routes.nests.eggs.main(nest), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }
}

export function createApp(domain: string, key: string): AppController {
    return new AppController(domain, key);
}
