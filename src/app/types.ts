import { FeatureLimits, Limits } from '../common';

export interface Allocation {
    id:         number;
    ip:         string;
    alias:      string | null;
    port:       number;
    notes:      string | null;
    assigned:   boolean;
}

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
    externalId: string | null;
    username:   string;
    email:      string;
    firstname:  string;
    lastname:   string;
    language:   string;
    rootAdmin:  boolean;
    '2fa':      boolean;
    createdAt:  number;
    updatedAt:  number | null;
}

export interface Container {
    startupCommand: number;
    image:          string;
    installed:      number;
    environment:    Record<string, string | number | boolean>;
}
