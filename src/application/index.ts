import { application as app } from '../endpoints';
import { PteroUser } from './structs';
import http from '../http/rest';
import transfomer from '../transformer';

export class AppController {
    public domain: string;
    public auth: string;

    constructor(domain: string, auth: string) {
        this.domain = domain;
        this.auth = auth;
    }

    async getUsers<T extends number | undefined>(
        id?: T,
        force: boolean = false
    ): Promise<T extends undefined ? PteroUser[] : PteroUser> {
        const data = await http.get<PteroUser>(
            id ? app.users.get(id) : app.users.main(),
            this.domain, this.auth
        );
        return id
            ? transfomer.fromAttributes<PteroUser>(data.attributes)
            : transfomer.fromData<PteroUser>(data.data) as any;
    }
}
