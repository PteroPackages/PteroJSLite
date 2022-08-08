import { Auth, FractalData, FractalItem } from '../common';
import { client as routes } from '../routes';
import { Account, APIKey, PermissionDescriptor, TwoFactorData } from './types';
import conv from '../conversions';
import http from '../http';

class ClientController {
    public auth: Auth;

    constructor(domain: string, key: string) {
        this.auth = { domain, key };
    }

    async getPermissions(): Promise<PermissionDescriptor> {
        const data = await http.get<
            FractalItem<{ permissions: PermissionDescriptor }>
        >(routes.permissions(), this.auth);
        return data!.attributes.permissions;
    }

    async getAccount(): Promise<Account> {
        const data = await http.get<FractalItem<Account>>(
            routes.account.main(), this.auth
        );
        return conv.toCamelCase(data!.attributes);
    }

    async getTwoFactorURL(): Promise<TwoFactorData> {
        const data = await http.get<{ data: TwoFactorData }>(
            routes.account.tfa(), this.auth
        );
        return conv.toCamelCase(
            data!.data, {
                map:{ 'image_url_data': 'image_URL_data' }
            }
        );
    }

    async enableTwoFactor(code: number): Promise<string[]> {
        const data = await http.post<FractalItem<string[]>>(
            routes.account.tfa(),
            this.auth,
            { code }
        );
        return data!.attributes;
    }

    async disableTwoFactor(password: string): Promise<void> {
        return http.delete(routes.account.tfa(), this.auth, { password });
    }

    async updateEmail(email: string, password: string): Promise<void> {
        return http.put(
            routes.account.email(),
            this.auth,
            { email, password }
        );
    }

    async updatePassword(oldPass: string, newPass: string): Promise<void> {
        return http.put(
            routes.account.password(),
            this.auth,
            {
                current_password: oldPass,
                password: newPass,
                password_confirmation: newPass
            }
        );
    }

    async getAPIKeys(): Promise<APIKey[]> {
        const data = await http.get<FractalData<APIKey>>(
            routes.account.apikeys.main(), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async createAPIKey(
        description: string,
        allowedIps: string[] = []
    ): Promise<APIKey> {
        const data = await http.post<FractalItem<APIKey>>(
            routes.account.apikeys.main(),
            this.auth,
            { description, allowed_ips: allowedIps }
        );
        return conv.toCamelCase(data!.attributes);
    }

    async deleteAPIKey(id: string): Promise<void> {
        return http.delete(routes.account.apikeys.get(id), this.auth);
    }
}

export function createClient(domain: string, key: string): ClientController {
    return new ClientController(domain, key);
}
