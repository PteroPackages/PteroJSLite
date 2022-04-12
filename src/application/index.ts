import { application as app } from '../endpoints';
import { CreateUserOptions, PteroUser } from './structs';
import http, { Auth } from '../http/rest';
import transfomer from '../transformer';

export class AppController {
    public auth: Auth;

    constructor(domain: string, key: string) {
        this.auth = { domain, key };
    }

    async getUsers<T extends number | undefined>(
        id?: T,
        force: boolean = false
    ): Promise<T extends undefined ? PteroUser[] : PteroUser> {
        const data = await http.get<PteroUser>(
            id ? app.users.get(id) : app.users.main(),
            this.auth
        );
        return id
            ? transfomer.fromAttributes<PteroUser>(data.attributes)
            : transfomer.fromData<PteroUser>(data.data) as any;
    }

    async createUser(options: CreateUserOptions): Promise<PteroUser> {
        const data = await http.post<PteroUser>(
            app.users.main(),
            this.auth,
            transfomer.intoJSON(options)
        );
        return transfomer.fromAttributes(data.attributes);
    }

    async updateUser(id: number, options: Partial<CreateUserOptions>): Promise<PteroUser> {
        if (!Object.keys(options).length) throw new Error('Not enough options to update the user.');
        const user = await this.getUsers(id);
        const data = await http.patch<PteroUser>(
            app.users.get(id),
            this.auth,
            transfomer.intoJSON(Object.assign(user, options))
        );
        return transfomer.fromAttributes(data.attributes);
    }

    async deleteUser(id: number): Promise<true> {
        await http.delete(app.users.get(id), this.auth);
        return true;
    }
}

export function createApp(domain: string, auth: string) {
    return new AppController(domain, auth);
}
