import {
    Auth,
    FetchOptions,
    Filter,
    FractalData,
    FractalItem,
    Include
} from '../common';
import {
    CreateServerOptions,
    CreateUserOptions,
    UpdateBuildOptions,
    UpdateDetailsOptions,
    UpdateStartupOptions,
    UpdateUserOptions,
} from './options';
import { application as routes } from '../routes';
import {
    Allocation,
    AppServer,
    Egg,
    Nest,
    Node,
    NodeConfig,
    RawUser,
    User,
} from './types';
import conv from '../conversions';
import http from '../http';

export interface IApplication {
    /** @returns An array of user objects. */
    getUsers(options?: Filter<Include<FetchOptions>>): Promise<User[]>;
    /**
     * @param id The ID or external ID of the user.
     * @returns A user object based on the ID specified. If it is a string, it will fetch
     * by the user's external ID, otherwise it will fetch by the user's normal ID.
     */
    getUsers(id: number | string, options?: Filter<Include<FetchOptions>>): Promise<User>;
    /**
     * Creates a user account with the specified options.
     * @param options The options to set.
     * @returns The new user.
     */
    createUser(options: CreateUserOptions): Promise<User>;
    /**
     * Updates a user account by its ID with the specified options.
     * @param id The ID of the user.
     * @param options The options to set.
     * @returns The updated user object.
     */
    updateUser(id: number, options: UpdateUserOptions): Promise<User>;
    /**
     * Deletes a user account by its ID.
     * @param id The ID of the user.
     */
    deleteUser(id: number): Promise<void>;
    /** @returns An array of application server objects. */
    getServers(): Promise<AppServer[]>;
    /**
     * @param id The ID or external ID of the server.
     * @returns An application server object with the specified ID. If it is a string, it will
     * fetch by the server's external ID, otherwise it will fetch by the server's normal ID.
     */
    getServers(id: number | string): Promise<AppServer>;
    /**
     * Creates a server with the specified files. Either the
     * {@link CreateServerOptions.allocation allocation} field or
     * {@link CreateServerOptions.deploy deploy} field must be specified for the server to be
     * created.
     * @param options The options to set.
     * @returns The new server.
     */
    createServer(
        options:
            | CreateServerOptions
            | Omit<CreateServerOptions, 'allocation'>
            | Omit<CreateServerOptions, 'deploy'>
    ): Promise<AppServer>;
    /**
     * Updates a server's details by its ID with the specified options.
     * @param id The ID of the server.
     * @param options The options to set.
     * @returns The updated server.
     */
    updateServerDetails(
        id: number,
        options: UpdateDetailsOptions
    ): Promise<AppServer>;
    /**
     * Updates a server's build configuration by its ID with the specified options.
     * @param id The ID of the server.
     * @param options The options to set.
     * @returns The updated server.
     */
    updateServerBuild(
        id: number,
        options: UpdateBuildOptions
    ): Promise<AppServer>;
    /**
     * Updates a server's startup configuration by its ID with the specified options.
     * @param id The ID of the server.
     * @param options The options to set.
     * @returns The updated server.
     */
    updateServerStartup(
        id: number,
        options: UpdateStartupOptions
    ): Promise<AppServer>;
    /**
     * Suspends a server by its ID, stopping it in the process if it is running.
     * @param id The ID of the server.
     */
    suspendServer(id: number): Promise<void>;
    /**
     * Unsuspends a server by its ID.
     * @param id The ID of the server.
     */
    unsuspendServer(id: number): Promise<void>;
    /**
     * Triggers the reinstall process of a server by its ID.
     * @param id The ID of the server.
     */
    reinstallServer(id: number): Promise<void>;
    /**
     * Deletes a server by its ID.
     * @param id The ID of the server.
     * @param [force] Whether the server should be forcefully deleted.
     */
    deleteServer(id: number, force: boolean): Promise<void>;
    /** @returns An array of node objects. */
    getNodes(): Promise<Node[]>;
    /**
     * @param id The ID of the node.
     * @returns A node object by its ID.
     */
    getNodes(id: number): Promise<Node>;
    /**
     * @param id The ID of the node.
     * @returns An array of node allocation objects.
     */
    getNodeAllocations(id: number): Promise<Allocation[]>;
    /**
     * @param id The ID of the node.
     * @returns The configuration object for the specified node.
     */
    getNodeConfig(id: number): Promise<NodeConfig>;
    /**
     * Creates one or more allocations for a node. The `ports` parameter supports the use of port
     * ranges for creating allocations instead of naming each individual port.
     * @example
     * ```
     * // creates 1000 allocations from port 5000 to port 6000.
     * app.createAllocations(2, '10.0.0.4', ['5000-6000']);
     * ```
     *
     * Allocations below port 1025 cannot be created, and you cannot create more than 1000
     * allocations per port range.
     * @param id The ID of the node.
     * @param ip The IP for the allocation(s).
     * @param ports The ports or port ranges to create allocations for.
     * @param [alias] The IP alias for the alloactions.
     */
    createNodeAllocations(
        id: number,
        ip: string,
        ports: string[],
        alias?: string
    ): Promise<void>;
    /**
     * Deletes a node by its ID. Note that this will not work if there are servers on the node.
     * @param id The ID of the node.
     */
    deleteNode(id: number): Promise<void>;
    /**
     * Deletes an allocation from the specified node.
     * @param node The ID of the node.
     * @param id The ID of the allocation.
     */
    deleteNodeAllocation(node: number, id: number): Promise<void>;
    /** @returns An array of nest objects. */
    getNests(): Promise<Nest[]>;
    /**
     * @param id The ID of the nest.
     * @returns A nest object by its ID.
     */
    getNests(id: number): Promise<Nest>;
    /**
     * @param nest The ID of the nest.
     * @returns An array of egg objects belonging to the specified nest.
     */
    getEggs(nest: number): Promise<Egg[]>;
    /**
     * @param nest The ID of the nest.
     * @param id The ID of the egg.
     * @returns An egg object by its ID in the specified nest.
     */
    getEggs(nest: number, id: number): Promise<Egg>;
}

/**
 * Represents the interface object for the Application API.
 * @see {@link IApplication} for more information and implementation.
 */
export type Application = IApplication & ThisType<{ auth: Auth }>;

/**
 * Creates an interface object for interacting with the Application API.
 * @see {@link IApplication} for more information and implementation.
 * @param url The URL for the panel.
 * @param key The API key to use.
 * @returns The interface object for the application API.
 */
export function createApp(url: string, key: string): Application;
export function createApp(auth: Auth): Application;
export function createApp(arg1: unknown, arg2?: string) {
    let auth: Auth;

    switch (typeof arg1) {
        case 'string': {
            if (!arg2) throw new Error('URL and key is required');
            auth = { url: arg1, key: arg2 };
            break;
        }
        case 'object': {
            if (arg1 === null)
                throw new Error('Expected Auth object; got null');
            if (arg1.hasOwnProperty('url') && arg1.hasOwnProperty('key')) {
                auth = arg1 as Auth;
                break;
            }
        }
        default: {
            throw new Error(
                `Expected URL and key or Auth object; got ${typeof arg1}`
            );
        }
    }

    const impl = <IApplication>{
        async getUsers(arg = undefined, op = undefined) {
            let path = routes.users.main();
            let q = typeof arg === 'object' || !!op;

            if (arg) {
                switch (typeof arg) {
                    case 'number':
                        path = routes.users.get(arg);
                        if (op) path += http.resolve(op);
                        break;
                    case 'string':
                        path = routes.users.ext(arg);
                        if (op) path += http.resolve(op);
                        break;
                    case 'object':
                        if (Array.isArray(arg)) throw new TypeError(
                            'expected number, string or fetch options; got an array'
                        );
                        path += http.resolve(arg);
                        break;
                    default:
                        throw new TypeError(
                            `expected number or string; got ${typeof arg}`
                        );
                }

                const data = await http.get<FractalItem<RawUser>>(path, this.auth);
                const raw = conv.toCamelCase<RawUser>(data.attributes);
                if (q) {
                    raw.relationships ||= {};
                    const { relationships, ...user } = raw;
                    if (relationships?.servers)
                        user.servers = conv.toCamelCase(relationships.servers.data.map(d => d.attributes));

                    return user;
                }

                return raw;
            }

            const data = await http.get<FractalData<RawUser>>(path, this.auth);
            const raw = data.data.map(d => conv.toCamelCase<RawUser>(d.attributes));
            if (q) {
                return raw.map(r => {
                    r.relationships ||= {};
                    const { relationships, ...user } = r;
                    if (relationships?.servers)
                        user.servers = conv.toCamelCase(relationships.servers.data.map(d => d.attributes));

                    return user;
                });
            }

            return raw;
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

        async getNodeAllocations(id) {
            const data = await http.get<FractalData<Allocation>>(
                routes.allocations.main(id),
                this.auth
            );
            return data.data.map(d => d.attributes);
        },

        async getNodeConfig(id) {
            const data = await http.get<NodeConfig>(
                routes.nodes.config(id),
                this.auth
            );
            return conv.toCamelCase(data);
        },

        createNodeAllocations(id, ip, ports, alias?) {
            return http.post(routes.allocations.main(id), this.auth, {
                ip,
                ports,
                alias,
            });
        },

        deleteNode(id) {
            return http.delete(routes.nodes.get(id), this.auth);
        },

        deleteNodeAllocation(node, id) {
            return http.delete(routes.allocations.get(node, id), this.auth);
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

    return <Application>{ auth, ...impl };
}
