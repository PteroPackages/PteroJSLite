import { application as app } from '../endpoints';
import { PteroUser } from './structs';
import caseConv from '../conversions';
import http from '../http/rest';

export class AppController {
    public domain: string;
    public auth: string;

    constructor(domain: string, auth: string) {
        this.domain = domain;
        this.auth = auth;
    }

    async getUsers(id?: number, force: boolean = false): Promise<PteroUser> {
        const data = await http.get<PteroUser>(
            id ? app.users.get(id) : app.users.main(),
            this.auth
        );
        return caseConv.toCamelCase(
            data.attributes, {
                map:{ '2fa': 'twoFactor' }
            }
        ) as PteroUser;
    }
}
