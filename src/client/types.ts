import { Limits } from '../common';

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
    invocation:     string;
    dockerImage:    string;
    eggFeatures:    string[] | null;
    status:         string | null;
    isSuspended:    boolean;
    isInstalling:   boolean;
    isTransferring: boolean;
}

export interface PermissionDescriptor {
    description:    string;
    keys:           Record<string, string>;
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
