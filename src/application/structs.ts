import { FeatureLimits, Limits } from '../common';

// Structures

export interface DaemonData {
    listening:  number;
    sftp:       number;
    base:       string;
}

export interface Node {
    id:                 number;
    uuid:               string;
    public:             boolean;
    name:               string;
    description:        string | undefined;
    location:           number;
    fqdn:               string;
    scheme:             string;
    behindProxy:        boolean;
    maintainance:       boolean;
    memory:             number;
    memoryOverallocate: number;
    disk:               number;
    diskOverallocate:   number;
    uploadSize:         number;
    daemon:             DaemonData;
}

export interface AppServer {
    id:             number;
    uuid:           string;
    identifier:     string;
    externalId:     string | undefined;
    name:           string;
    description:    string | undefined;
    status:         string | undefined;
    suspended:      boolean;
    limits:         Limits;
    featureLimits:  FeatureLimits;
    user:           number;
    node:           number;
    nest:           number;
    egg:            number;
    container:      Container;
    createdAt:      number;
    updatedAt:      number;
}

export interface PteroUser {
    id:         number;
    uuid:       string;
    identifier: string;
    externalId: string | undefined;
    username:   string;
    email:      string;
    firstname:  string;
    lastname:   string;
    language:   string;
    rootAdmin:  boolean;
    '2fa':      boolean;
    createdAt:  number;
    updatedAt:  number | undefined;
}

// Option interfaces/types

export interface CreateUserOptions {
    email:      string;
    username:   string;
    firstName:  string;
    lastName:   string;
    password?:  string;
    rootAdmin?: boolean;
}

export interface Container {
    startupCommand: number;
    image:          string;
    installed:      number;
    environment:    { [key: string]: string | number | boolean };
}
