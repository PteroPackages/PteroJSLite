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

export interface IClient {
    /** @returns A descriptor object containing all the available permissions. */
    getPermissions(): Promise<PermissionDescriptor>;
    /** @returns The account object. */
    getAccount(): Promise<Account>;
    /** @returns The two-factor authentication credentials. */
    getTwoFactorData(): Promise<TwoFactorData>;
    /**
     * Enabled two-factor authentication for the account.
     * @param code The two-factor authentication code.
     */
    enableTwoFactor(code: number): Promise<string[]>;
    /**
     * Disables two-factor authentication for the account.
     * @param password The account password.
     */
    disableTwoFactor(password: string): Promise<void>;
    /**
     * Updates the email for the account.
     * @param email The new email.
     * @param password The account password.
     */
    updateEmail(email: string, password: string): Promise<void>;
    /**
     * Updates the password for the account. Note that this will invalidate all existing browser
     * sessions with the account.
     * @param oldPass The old password.
     * @param newPass The new password.
     */
    updatePassword(oldPass: string, newPass: string): Promise<void>;
    /** @returns An array of account activity objects. */
    getActivities(): Promise<Activity[]>;
    /** @returns An array of API key objects. */
    getAPIKeys(): Promise<APIKey[]>;
    /**
     * Creates an API key associated with the account.
     * @param description A brief description of the API key.
     * @param allowedIps An array of whitelisted IPs for the API key. Use an empty array to allow
     * all origins.
     * @returns The new API key.
     */
    createAPIKey(description: string, allowedIps: string[]): Promise<APIKey>;
    /**
     * Deletes an API key associated with the account.
     * @param id The identifier of the API key.
     */
    deleteAPIKey(id: string): Promise<void>;
    /** @returns An array of SSH key objects. */
    getSSHKeys(): Promise<SSHKey[]>;
    /**
     * Creates an SSH key associated with the account.
     * @param name The name of the SSH key.
     * @param publicKey The public key of the SSH key.
     * @returns The new SSH key.
     */
    createSSHKey(name: string, publicKey: string): Promise<SSHKey>;
    /**
     * Removes an SSH key associated with the account.
     * @param fingerprint The fingerprint for the SSH key.
     */
    removeSSHKey(fingerprint: string): Promise<void>;
    /** @returns An array of server objects. */
    getServers(): Promise<ClientServer[]>;
    /**
     * @param id The identifier of the server.
     * @returns A server object based on the identifier specified.
     */
    getServers(id: string): Promise<ClientServer>;
    /**
     * Gets the websocket authentication credentials for a specified server. Note that this does
     * not perform any interactions with the server websocket.
     * @param id The identifier of the server.
     * @returns The websocket authentication credentials for the server.
     */
    getServerWebsocketAuth(id: string): Promise<WebSocketAuth>;
    /**
     * @param id The identifier of the server.
     * @returns An object containing all the resource information of a server.
     */
    getServerResources(id: string): Promise<Resources>;
    /**
     * @param id The identifier of the server.
     * @returns An array of server activity objects.
     */
    getServerActivities(id: string): Promise<Activity[]>;
    /**
     * Sends a command to the console of a server.
     * @param id The identifier of the server.
     * @param command The command to send.
     */
    sendServerCommand(id: string, command: string): Promise<void>;
    /**
     * Sets the power state of a server, this can be:
     * * start
     * * stop
     * * restart
     * * kill
     *
     * @param id The identifier of the server.
     * @param signal The power signal to send.
     */
    setServerPowerState(id: string, signal: PowerSignal): Promise<void>;
    /**
     * @param id The identifier of the server.
     * @returns An array of file objects.
     */
    getServerFiles(id: string): Promise<File[]>;
    /**
     * Gets the contents of a file on a server.
     * @param id The identifier of the server.
     * @param name The name of the file.
     * @returns The file contents.
     */
    getFileContents(id: string, name: string): Promise<String>;
    /**
     * @param id The identifier of the server.
     * @param name The name of the file to download.
     * @returns The download URL of a specified file on a server.
     */
    getFileDownloadURL(id: string, name: string): Promise<string>;
    /**
     * Renames one or more files in the file system of a server.
     * @param id The identifier of the server.
     * @param root The root directory of the files.
     * @param data The file rename data.
     */
    renameFiles(id: string, root: string, data: RenameData): Promise<void>;
    /**
     * Copies a specified file on the file system of a server. The copied file will have "copy"
     * appended to the name.
     * @param id The identifier of the server.
     * @param name The name of the file.
     */
    copyFile(id: string, name: string): Promise<void>;
    /**
     * Writes the specified contents to a file on the file system of a server. If the file does not
     * exist, it will be created instead.
     * @param id The identifier of the server.
     * @param name The name of the file.
     * @param content The content to write.
     */
    writeFile(id: string, name: string, content: string): Promise<void>;
    /**
     * Creates a file on the file system of a server. If the file already exists, the request is
     * ignored.
     * @param id The identifier of the server.
     * @param name The name of the file.
     */
    createFile(id: string, name: string): Promise<void>;
    /**
     * Compresses one or more files into a single archive.
     * @param id The identifier of the server.
     * @param root The root directory of the files.
     * @param files The names of the files.
     * @returns The compressed (or archived) file.
     */
    compressFiles(id: string, root: string, files: string[]): Promise<File>;
    /**
     * Decompresses a compressed (or archived) file.
     * @param id The identifier of the server.
     * @param root The root directory of the file.
     * @param name The name of the file.
     */
    decompressFile(id: string, root: string, name: string): Promise<void>;
    /**
     * Deletes one or more files from the file system of a server.
     * @param id The identifier of the server.
     * @param root The root directory of the files.
     * @param files The names of the files to delete.
     */
    deleteFiles(id: string, root: string, files: string[]): Promise<void>;
    /**
     * Creates a folder in the file system of a server.
     * @param id The identifier of the server.
     * @param root The root directory to use.
     * @param name The name of the folder.
     */
    createFolder(id: string, root: string, name: string): Promise<void>;
    /**
     * Changes the file permission of one or more files in a server.
     * @param id The identifier of the server.
     * @param root The root directory of the files.
     * @param data The file names and modes to change.
     */
    chmodFiles(id: string, root: string, data: ChmodData): Promise<void>;
    /**
     * Pulls a file from an external site or domain into the file system of a server.
     * @param id The identifier of the server.
     * @param options Options to set when pulling the file.
     */
    pullFile(id: string, options: PullFileOptions): Promise<void>;
    /**
     * @param id The identifier of the server.
     * @returns The upload URL for the file manager of a server.
     */
    getFileUploadURL(id: string): Promise<string>;
}

/**
 * Represents the interface object for the Client API.
 * @see {@link IClient} for more information and implementation.
 */
export type Client = IClient & ThisType<{ auth: Auth }>;

/**
 * Creates an interface object for the Client API.
 * @see {@link IClient} for more information and implementation.
 * @param url The URL for the panel.
 * @param key The API key to use. This **cannot** be an application API key.
 * @returns The interface object for the Client API.
 */
export function createClient(url: string, key: string): Client;
export function createClient(auth: Auth): Client;
export function createClient(arg1: unknown, arg2?: string) {
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

    const impl = <IClient>{
        async getPermissions() {
            const data = await http.get<
                FractalItem<{ permissions: PermissionDescriptor }>
            >(routes.permissions(), this.auth);
            return data.attributes.permissions;
        },

        async getAccount() {
            const data = await http.get<FractalItem<Account>>(
                routes.account.main(),
                this.auth
            );
            return conv.toCamelCase(data.attributes);
        },

        async getTwoFactorData() {
            const data = await http.get<{ data: TwoFactorData }>(
                routes.account.tfa(),
                this.auth
            );
            return conv.toCamelCase(data.data, {
                map: { image_url_data: 'image_URL_data' },
            });
        },

        async enableTwoFactor(code) {
            const data = await http.post<FractalItem<string[]>>(
                routes.account.tfa(),
                this.auth,
                { code }
            );
            return data.attributes;
        },

        disableTwoFactor(password) {
            return http.delete(routes.account.tfa(), this.auth, { password });
        },

        updateEmail(email, password) {
            return http.put(routes.account.email(), this.auth, {
                email,
                password,
            });
        },

        updatePassword(oldPass, newPass) {
            return http.put(routes.account.password(), this.auth, {
                current_password: oldPass,
                password: newPass,
                password_confirmation: newPass,
            });
        },

        async getActivities() {
            const data = await http.get<FractalData<Activity>>(
                routes.account.activity(),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async getAPIKeys() {
            const data = await http.get<FractalData<APIKey>>(
                routes.account.apikeys.main(),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async createAPIKey(description, allowedIps) {
            const data = await http.post<FractalItem<APIKey>>(
                routes.account.apikeys.main(),
                this.auth,
                { description, allowed_ips: allowedIps }
            );
            return conv.toCamelCase(data.attributes);
        },

        deleteAPIKey(id) {
            return http.delete(routes.account.apikeys.get(id), this.auth);
        },

        async getSSHKeys() {
            const data = await http.get<FractalData<SSHKey>>(
                routes.account.sshkeys.main(),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async createSSHKey(name, publicKey) {
            const data = await http.post<FractalItem<SSHKey>>(
                routes.account.sshkeys.main(),
                this.auth,
                { name, public_key: publicKey }
            );
            return conv.toCamelCase(data.attributes);
        },

        removeSSHKey(fingerprint) {
            return http.post(routes.account.sshkeys.remove(), this.auth, {
                fingerprint,
            });
        },

        async getServers(arg = undefined): Promise<any> {
            if (arg) {
                const data = await http.get<FractalItem<ClientServer>>(
                    routes.servers.get(arg as string),
                    this.auth
                );
                return conv.toCamelCase(data.attributes);
            }

            const data = await http.get<FractalData<ClientServer>>(
                routes.servers.main(),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        async getServerWebsocketAuth(id) {
            const data = await http.get<{ data: WebSocketAuth }>(
                routes.servers.ws(id),
                this.auth
            );
            return conv.toCamelCase(data.data);
        },

        async getServerResources(id) {
            const data = await http.get<FractalItem<Resources>>(
                routes.servers.resources(id),
                this.auth
            );
            return conv.toCamelCase(data.attributes);
        },

        async getServerActivities(id) {
            const data = await http.get<FractalData<Activity>>(
                routes.servers.activity(id),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        sendServerCommand(id, command) {
            return http.post(routes.servers.command(id), this.auth, {
                command,
            });
        },

        setServerPowerState(id, signal) {
            return http.post(routes.servers.power(id), this.auth, { signal });
        },

        // section: databases

        async getServerFiles(id) {
            const data = await http.get<FractalData<File>>(
                routes.servers.files.main(id),
                this.auth
            );
            return data.data.map(d => conv.toCamelCase(d.attributes));
        },

        getFileContents(id, name) {
            return http.get<string>(
                routes.servers.files.contents(id, encodeURIComponent(name)),
                this.auth,
                undefined,
                true
            );
        },

        async getFileDownloadURL(id, name) {
            const data = await http.get<FractalItem<{ url: string }>>(
                routes.servers.files.download(id, encodeURIComponent(name)),
                this.auth
            );
            return data.attributes.url;
        },

        async renameFiles(id, root, data) {
            return http.post(routes.servers.files.rename(id), this.auth, {
                root,
                files: data,
            });
        },

        copyFile(id, name) {
            return http.post(routes.servers.files.copy(id), this.auth, {
                location: name,
            });
        },

        writeFile(id, name, content) {
            return http.post(
                routes.servers.files.write(id, encodeURIComponent(name)),
                this.auth,
                content,
                true
            );
        },

        createFile(id, name) {
            return this.writeFile(id, name, '');
        },

        async compressFiles(id, root, files) {
            const data = await http.post<FractalItem<File>>(
                routes.servers.files.compress(id),
                this.auth,
                { root, files }
            );
            return conv.toCamelCase(data.attributes);
        },

        decompressFile(id, root, name) {
            return http.post(routes.servers.files.decompress(id), this.auth, {
                root,
                file: name,
            });
        },

        deleteFiles(id, root, files) {
            return http.post(routes.servers.files.delete(id), this.auth, {
                root,
                files,
            });
        },

        createFolder(id, root, name) {
            return http.post(routes.servers.files.create(id), this.auth, {
                root,
                name,
            });
        },

        chmodFiles(id, root, data) {
            return http.post(routes.servers.files.chmod(id), this.auth, {
                root,
                files: data,
            });
        },

        pullFile(id, options) {
            return http.post(
                routes.servers.files.pull(id),
                this.auth,
                conv.toSnakeCase(options)
            );
        },

        async getFileUploadURL(id) {
            const data = await http.get<FractalItem<{ url: string }>>(
                routes.servers.files.upload(id),
                this.auth
            );
            return data.attributes.url;
        },
    };

    return <Client>{ auth, ...impl };
}
