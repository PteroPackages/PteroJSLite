import { FeatureLimits, Limits } from '../common';

export interface Allocation {
    id: number;
    ip: string;
    alias: string | null;
    port: number;
    notes: string | null;
    assigned: boolean;
}

export interface Egg {
    id: number;
    uuid: string;
    name: string;
    author: string;
    description: string;
    dockerImage: string;
    dockerImages: Record<string, string>;
    config: {
        files: Record<string, Record<string, any>> | [];
        startup: Record<string, string>;
        stop: string;
        logs: Record<string, string> | [];
        fileDenylist: string[];
        extends: string | null;
    };
    startup: string;
    script: {
        privileged: boolean;
        install: string;
        entry: string;
        container: string;
        extends: string | null;
    };
    createdAt: string;
    updatedAt: string | null;
}

export interface Nest {
    id: number;
    uuid: string;
    author: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface Node {
    id: number;
    uuid: string;
    public: boolean;
    name: string;
    description: string | undefined;
    location: number;
    fqdn: string;
    scheme: string;
    behindProxy: boolean;
    maintainance: boolean;
    memory: number;
    memoryOverallocate: number;
    disk: number;
    diskOverallocate: number;
    uploadSize: number;
    daemonListen: number;
    daemonSftp: number;
    daemonBase: string;
    allocatedResources: {
        memory: number;
        disk: number;
    };
    createdAt: string;
    updatedAt: string | null;
}

export interface NodeConfig {
    debug: boolean;
    uuid: string;
    tokenId: string;
    token: string;
    api: {
        host: string;
        port: number;
        ssl: {
            enabled: boolean;
            cert: string;
            key: string;
        };
        uploadLimit: number;
    };
    system: {
        data: string;
        sftp: {
            bindPort: number;
        };
    };
    remote: string;
}

export interface AppServer {
    id: number;
    uuid: string;
    identifier: string;
    externalId: string | undefined;
    name: string;
    description: string | undefined;
    status: string | undefined;
    suspended: boolean;
    limits: Limits;
    featureLimits: FeatureLimits;
    user: number;
    node: number;
    nest: number;
    egg: number;
    container: Container;
    createdAt: string;
    updatedAt: string | null;
}

export interface User {
    id: number;
    uuid: string;
    identifier: string;
    externalId: string | null;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    language: string;
    rootAdmin: boolean;
    '2fa': boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface Container {
    startupCommand: number;
    image: string;
    installed: number;
    environment: Record<string, string | number | boolean>;
}
