import { Auth, FractalData, FractalItem } from '../common';
import { client as routes } from '../routes';
import { Account, APIKey } from './types';
import conv from '../conversions';
import http from '../http';

class ClientController {
    public auth: Auth;

    constructor(domain: string, key: string) {
        this.auth = { domain, key };
    }

    async getAccount(): Promise<Account> {
        const data = await http.get<FractalItem<Account>>(
            routes.account.main(), this.auth
        );
        return conv.toCamelCase(data!.attributes);
    }

    async getAPIKeys(): Promise<APIKey[]> {
        const data = await http.get<FractalData<APIKey>>(
            routes.account.apikeys(), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }
}

export function createClient(domain: string, key: string): ClientController {
    return new ClientController(domain, key);
}
