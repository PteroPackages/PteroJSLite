import { FeatureLimits, Limits } from '../common';

export interface Account {
    id:         number;
    admin:      boolean;
    username:   string;
    email:      string;
    firstName:  string;
    lastName:   string;
    language:   string;
}

export interface Activity {
    id:                     string;
    batch:                  unknown;
    event:                  string;
    isAPI:                  boolean;
    ip:                     string | null;
    description:            string | null;
    properties:             Record<string, any> | [];
    hasAdditionalMetadata:  boolean;
    timestamp:              string;
}

export interface APIKey {
    identifier:     string;
    description:    string;
    allowedIps:     string[];
    createdAt:      number;
    lastUsedAt:     number;
}

export type ChmodData = { file: string; mode: number }[];

export interface ClientServer {
    serverOwner:    boolean;
    identifier:     string;
    internalId:     number;
    uuid:           string;
    name:           string;
    node:           string;
    sftpDetails:{
        ip:         string;
        port:       number;
    }
    description:    string | null;
    limits:         Limits;
    featureLimits:  FeatureLimits;
    invocation:     string;
    dockerImage:    string;
    eggFeatures:    string[] | null;
    status:         string | null;
    isSuspended:    boolean;
    isInstalling:   boolean;
    isTransferring: boolean;
}

export interface File {
    name:       string;
    mode:       string;
    modeBits:   string;
    size:       number;
    isFile:     boolean;
    isSymlink:  boolean;
    mimetype:   string;
    createdAt:  string;
    modifiedAt: string | null;
}

export interface PermissionDescriptor {
    description:    string;
    keys:           Record<string, string>;
}

export enum PowerSignal {
    START   = 'start',
    STOP    = 'stop',
    RESTART = 'restart',
    KILL    = 'kill'
}

export interface PullFileOptions {
    url:            string;
    directory?:     string;
    filename?:      string;
    useHeader?:     boolean;
    foreground?:    boolean;
}

export type RenameData = { from: string; to: string }[];

export interface ResourceUsage {
    memoryBytes:    number;
    diskBytes:      number;
    cpuAbsolute:    number;
    networkRxBytes: number;
    networkTxBytes: number;
    uptime:         number;
}

export interface Resources {
    currentState:   string;
    suspended:      boolean;
    resources:      ResourceUsage;
}

export interface SSHKey {
    name:           string;
    fingerprint:    string;
    publicKey:      string;
    createdAt:      string;
}

export interface TwoFactorData {
    imageURLData:   string;
    secret:         string;
}

export interface WebSocketAuth {
    socket: string;
    token:  string;
}
