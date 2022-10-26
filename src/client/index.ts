import { Auth, FractalData, FractalItem } from '../common';
import { client as routes } from '../routes';
import {
    Account,
    Activity,
    APIKey,
    ChmodData,
    ClientServer,
    File,
    PermissionDescriptor,
    PowerSignal,
    PullFileOptions,
    RenameData,
    Resources,
    SSHKey,
    TwoFactorData,
    WebSocketAuth,
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
            routes.account.main(),
            this.auth
        );
        return conv.toCamelCase(data!.attributes);
    }

    async getTwoFactorURL(): Promise<TwoFactorData> {
        const data = await http.get<{ data: TwoFactorData }>(
            routes.account.tfa(),
            this.auth
        );
        return conv.toCamelCase(data!.data, {
            map: { image_url_data: 'image_URL_data' },
        });
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
        return http.put(routes.account.email(), this.auth, { email, password });
    }

    async updatePassword(oldPass: string, newPass: string): Promise<void> {
        return http.put(routes.account.password(), this.auth, {
            current_password: oldPass,
            password: newPass,
            password_confirmation: newPass,
        });
    }

    async getActivities(): Promise<Activity[]> {
        const data = await http.get<FractalData<Activity>>(
            routes.account.activity(),
            this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async getAPIKeys(): Promise<APIKey[]> {
        const data = await http.get<FractalData<APIKey>>(
            routes.account.apikeys.main(),
            this.auth
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
        return http.post(routes.account.sshkeys.remove(), this.auth, {
            fingerprint,
        });
    }

    async getServers(): Promise<ClientServer[]>;
    async getServers(id: string): Promise<ClientServer>;
    async getServers(arg: any = null): Promise<any> {
        if (arg) {
            const data = await http.get<FractalItem<ClientServer>>(
                routes.servers.get(arg),
                this.auth
            );
            return conv.toCamelCase(data!.attributes);
        }

        const data = await http.get<FractalData<ClientServer>>(
            routes.servers.main(),
            this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async getServerWebsocketAuth(id: string): Promise<WebSocketAuth> {
        const data = await http.get<{ data: WebSocketAuth }>(
            routes.servers.ws(id),
            this.auth
        );
        return conv.toCamelCase(data!.data);
    }

    async getServerResources(id: string): Promise<Resources> {
        const data = await http.get<FractalItem<Resources>>(
            routes.servers.resources(id),
            this.auth
        );
        return conv.toCamelCase(data!.attributes);
    }

    async getServerActivities(id: string): Promise<Activity[]> {
        const data = await http.get<FractalData<Activity>>(
            routes.servers.activity(id),
            this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async sendServerCommand(id: string, command: string): Promise<void> {
        return http.post(routes.servers.command(id), this.auth, { command });
    }

    async setServerPowerState(id: string, signal: PowerSignal): Promise<void> {
        return http.post(routes.servers.power(id), this.auth, { signal });
    }

    // section: databases

    async getServerFiles(id: string): Promise<File[]> {
        const data = await http.get<FractalData<File>>(
            routes.servers.files.main(id),
            this.auth
        );
        return data!.data.map(d => conv.toCamelCase(d.attributes));
    }

    async getFileContents(id: string, name: string): Promise<Buffer> {
        const data = await http.get<string>(
            routes.servers.files.contents(id, encodeURIComponent(name)),
            this.auth,
            undefined,
            true
        );
        return Buffer.from(data!);
    }

    async getFileDownloadURL(id: string, name: string): Promise<string> {
        const data = await http.get<FractalItem<{ url: string }>>(
            routes.servers.files.download(id, encodeURIComponent(name)),
            this.auth
        );
        return data!.attributes.url;
    }

    // TODO: downloadFile

    async renameFiles(
        id: string,
        root: string,
        data: RenameData
    ): Promise<void> {
        return http.post(routes.servers.files.rename(id), this.auth, {
            root,
            files: data,
        });
    }

    async copyFile(id: string, name: string): Promise<void> {
        return http.post(routes.servers.files.copy(id), this.auth, {
            location: name,
        });
    }

    async writeFile(id: string, name: string, content: string): Promise<void> {
        return http.post(
            routes.servers.files.write(id, encodeURIComponent(name)),
            this.auth,
            content,
            true
        );
    }

    async createFile(id: string, name: string): Promise<void> {
        return this.writeFile(id, name, '');
    }

    async compressFiles(
        id: string,
        root: string,
        files: string[]
    ): Promise<File> {
        const data = await http.post<FractalItem<File>>(
            routes.servers.files.compress(id),
            this.auth,
            { root, files }
        );
        return conv.toCamelCase(data!.attributes);
    }

    async decompressFile(
        id: string,
        root: string,
        name: string
    ): Promise<void> {
        return http.post(routes.servers.files.decompress(id), this.auth, {
            root,
            file: name,
        });
    }

    async deleteFiles(
        id: string,
        root: string,
        files: string[]
    ): Promise<void> {
        return http.post(routes.servers.files.delete(id), this.auth, {
            root,
            files,
        });
    }

    async createFolder(id: string, root: string, name: string): Promise<void> {
        return http.post(routes.servers.files.create(id), this.auth, {
            root,
            name,
        });
    }

    async chmodFiles(id: string, root: string, data: ChmodData): Promise<void> {
        return http.post(routes.servers.files.chmod(id), this.auth, {
            root,
            files: data,
        });
    }

    async pullFile(id: string, options: PullFileOptions): Promise<void> {
        return http.post(
            routes.servers.files.pull(id),
            this.auth,
            conv.toSnakeCase(options)
        );
    }

    async getUploadURL(id: string): Promise<string> {
        const data = await http.get<FractalItem<{ url: string }>>(
            routes.servers.files.upload(id),
            this.auth
        );
        return data!.attributes.url;
    }

    // TODO: uploadFiles
}

export function createClient(domain: string, key: string): ClientController {
    return new ClientController(domain, key);
}
