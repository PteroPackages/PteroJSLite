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

export interface AppServer {}

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
    twoFactor:  boolean;
    createdAt:  number;
    updatedAt:  number | undefined;
}
