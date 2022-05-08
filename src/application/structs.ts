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

export interface User {
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

export interface Container {
    startupCommand: number;
    image:          string;
    installed:      number;
    environment:    Record<string, string | number | boolean>;
}

export interface CreateServerOptions {
    name:               string;
    description?:       string;
    externalId?:        string;
    user:               number;
    egg:                number;
    dockerImage:        string;
    startup:            string;
    environment:        Record<string, string>;
    skipScripts?:       boolean;
    oomDisabled?:       boolean;
    limits?:            Partial<Limits>;
    featureLimits?:     Partial<FeatureLimits>;
    allocation:{
        default:        number;
        additional?:    string[];
    };
    deploy?:{
        locations:      number[];
        portRange:      string[];
        dedicatedIp:    string;
    };
    startOnCompletion?: boolean;
}

export interface CreateUserOptions {
    email:      string;
    username:   string;
    firstName:  string;
    lastName:   string;
    password?:  string;
    rootAdmin?: boolean;
}

export interface UpdateBuildOptions extends Partial<Limits & FeatureLimits> {
    allocation?:        number;
    oomDisabled?:       boolean;
    addAllocations?:    number[];
    removeAllocations?: number[];
}

export interface UpdateDetailsOptions {
    name?:          string;
    user?:          number;
    externalId?:    string;
    description?:   string;
}

export interface UpdateStartupOptions {
    startup?:       string;
    environment?:   Record<string, string>;
    egg?:           number;
    image?:         string;
    skipScripts?:   boolean;
}
