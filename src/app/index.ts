import { Auth, FractalData, FractalItem } from '../common';
import {
    CreateServerOptions,
    CreateUserOptions,
    UpdateBuildOptions,
    UpdateDetailsOptions,
    UpdateStartupOptions,
    UpdateUserOptions,
} from './options';
import { application as routes } from '../routes';
import { AppServer, Egg, Nest, Node, NodeConfig, User } from './types';
import conv from '../conversions';
import http from '../http';

export interface IApplication {
    getUsers(): Promise<User[]>;
    getUsers(id: number | string): Promise<User>;
    createUser(options: CreateUserOptions): Promise<User>;
    updateUser(id: number, options: UpdateUserOptions): Promise<User>;
    deleteUser(id: number): Promise<void>;
    getServers(): Promise<AppServer[]>;
    getServers(id: number | string): Promise<AppServer>;
    createServer(
        options:
            | CreateServerOptions
            | Omit<CreateServerOptions, 'allocation'>
            | Omit<CreateServerOptions, 'deploy'>
    ): Promise<AppServer>;
    updateServerDetails(
        id: number,
        options: UpdateDetailsOptions
    ): Promise<AppServer>;
    updateServerBuild(
        id: number,
        options: UpdateBuildOptions
    ): Promise<AppServer>;
    updateServerStartup(
        id: number,
        options: UpdateStartupOptions
    ): Promise<AppServer>;
    suspendServer(id: number): Promise<void>;
    unsuspendServer(id: number): Promise<void>;
    reinstallServer(id: number): Promise<void>;
    deleteServer(id: number, force: boolean): Promise<void>;
    getNodes(): Promise<Node[]>;
    getNodes(id: number): Promise<Node>;
    getNodeConfig(id: number): Promise<NodeConfig>;
    deleteNode(id: number): Promise<void>;
    getNests(): Promise<Nest[]>;
    getNests(id: number): Promise<Nest>;
    getEggs(nest: number): Promise<Egg[]>;
    getEggs(nest: number, id: number): Promise<Egg>;
}

export type Application = IApplication & ThisType<{ auth: Auth }>;

export function createApp(domain: string, key: string): Application {
    const impl = <IApplication>{
        async getUsers(arg = undefined) {
            let path = routes.users.main();
            if (arg) {
                switch (typeof arg) {
                    case 'number':
                        path = routes.users.get(arg);
                        break;
                    case 'string':
                        path = routes.users.ext(arg);
                        break;
                    default:
                        throw new TypeError(
                            `expected number or string; got ${typeof arg}`
                        );
                }

                const data = await http.get<FractalItem<User>>(path, this.auth);
                return conv.toCamelCase(data.attributes);
            }

            const data = await http.get<FractalData<User>>(path, this.auth);
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async createUser(options) {
            const data = await http.post<FractalItem<User>>(
                routes.users.main(),
                this.auth,
                conv.toSnakeCase(options)
            );
            return conv.toCamelCase(data.attributes);
        },

        async updateUser(id, options) {
            const data = await http.patch<FractalItem<User>>(
                routes.users.get(id),
                this.auth,
                conv.toSnakeCase(options)
            );
            return conv.toCamelCase(data.attributes);
        },

        deleteUser(id) {
            return http.delete(routes.users.get(id), this.auth);
        },

        async getServers(arg = undefined) {
            let path = routes.servers.main();
            if (arg) {
                switch (typeof arg) {
                    case 'number':
                        path = routes.servers.get(arg);
                        break;
                    case 'string':
                        path = routes.servers.ext(arg);
                        break;
                    default:
                        throw new TypeError(
                            `expected number or string; got ${typeof arg}`
                        );
                }

                const data = await http.get<FractalItem<AppServer>>(
                    path,
                    this.auth
                );
                return conv.toCamelCase(data.attributes, {
                    pass: ['environment'],
                });
            }

            const data = await http.get<FractalData<AppServer>>(
                path,
                this.auth
            );
            return data!.data.map(d =>
                conv.toCamelCase(d.attributes, { pass: ['environment'] })
            );
        },

        async createServer(options) {
            const data = await http.post<FractalItem<AppServer>>(
                routes.servers.main(),
                this.auth,
                conv.toSnakeCase(options)
            );
            return conv.toCamelCase(data.attributes);
        },

        async updateServerDetails(id, options) {
            const data = await http.patch<FractalItem<AppServer>>(
                routes.servers.details(id),
                this.auth,
                conv.toSnakeCase(options)
            );
            return conv.toCamelCase(data.attributes);
        },

        async updateServerBuild(id, options) {
            const data = await http.patch<FractalItem<AppServer>>(
                routes.servers.build(id),
                this.auth,
                conv.toSnakeCase(options)
            );
            return conv.toCamelCase(data.attributes);
        },

        async updateServerStartup(id, options) {
            const data = await http.patch<FractalItem<AppServer>>(
                routes.servers.startup(id),
                this.auth,
                conv.toSnakeCase(options)
            );
            return conv.toCamelCase(data.attributes);
        },

        suspendServer(id) {
            return http.post(routes.servers.suspend(id), this.auth);
        },

        unsuspendServer(id) {
            return http.post(routes.servers.unsuspend(id), this.auth);
        },

        reinstallServer(id) {
            return http.post(routes.servers.reinstall(id), this.auth);
        },

        deleteServer(id, force = false) {
            if (force)
                return http.delete(
                    routes.servers.get(id) + '/force',
                    this.auth
                );
            return http.delete(routes.servers.get(id), this.auth);
        },

        async getNodes(arg = undefined) {
            if (arg) {
                const data = await http.get<FractalItem<Node>>(
                    routes.nodes.get(arg as number),
                    this.auth
                );
                return conv.toCamelCase(data.attributes);
            }

            const data = await http.get<FractalData<Node>>(
                routes.nodes.main(),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async getNodeConfig(id) {
            const data = await http.get<NodeConfig>(
                routes.nodes.config(id),
                this.auth
            );
            return conv.toCamelCase(data);
        },

        deleteNode(id) {
            return http.delete(routes.nodes.get(id), this.auth);
        },

        async getNests(arg = undefined) {
            if (arg) {
                const data = await http.get<FractalItem<Nest>>(
                    routes.nests.get(arg as number),
                    this.auth
                );
                return conv.toCamelCase(data.attributes);
            }

            const data = await http.get<FractalData<Nest>>(
                routes.nests.main(),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async getEggs(nest, arg = undefined) {
            if (arg) {
                const data = await http.get<FractalItem<Egg>>(
                    routes.nests.eggs.get(nest, arg as number),
                    this.auth
                );
                return conv.toCamelCase(data.attributes);
            }

            const data = await http.get<FractalData<Egg>>(
                routes.nests.eggs.main(nest),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },
    };

    return <Application>{
        auth: { domain, key },
        ...impl,
    };
}
