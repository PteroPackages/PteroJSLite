import { Auth, FractalData, FractalItem } from '../common';
import { client as routes } from '../routes';
import {
    Account,
    Activity,
    APIKey,
    ClientServer,
    PermissionDescriptor,
    SSHKey,
    TwoFactorData
} from './types';
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

    async getActivities(): Promise<Activity[]> {
        const data = await http.get<FractalData<Activity>>(
            routes.account.activity(), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
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

    async getSSHKeys(): Promise<SSHKey[]> {
        const data = await http.get<FractalData<SSHKey>>(
            routes.account.sshkeys.main(),
            this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async createSSHKey(name: string, publicKey: string): Promise<SSHKey> {
        const data = await http.post<FractalItem<SSHKey>>(
            routes.account.sshkeys.main(),
            this.auth,
            { name, public_key: publicKey }
        );
        return conv.toCamelCase(data!.attributes);
    }

    async removeSSHKey(fingerprint: string): Promise<void> {
        return http.post(
            routes.account.sshkeys.remove(),
            this.auth,
            { fingerprint }
        );
    }

    async getServers(): Promise<ClientServer[]>;
    async getServers(id: string): Promise<ClientServer>;
    async getServers(arg: any = null): Promise<any> {
        if (arg) {
            const data = await http.get<FractalItem<ClientServer>>(
                routes.servers.get(arg), this.auth
            );
            return conv.toCamelCase(data!.attributes);
        }

        const data = await http.get<FractalData<ClientServer>>(
            routes.servers.main(), this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }
}

export function createClient(domain: string, key: string): ClientController {
    return new ClientController(domain, key);
}
