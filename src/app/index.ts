import { Auth, FractalData, FractalItem } from '../common';
import { CreateUserOptions, UpdateUserOptions } from './options';
import { application as routes } from '../routes';
import { User } from './types';
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

            const data = await http.get<FractalItem<User>>(path, this.auth)!;
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
}

export function createApp(domain: string, key: string): AppController {
    return new AppController(domain, key);
}
