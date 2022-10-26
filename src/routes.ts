export const application = {
    users: {
        main: () => '/api/application/users',
        get: (u: number) => `/api/application/users/${u}`,
        ext: (u: string) => `/api/application/users/external/${u}`,
    },
    nodes: {
        main: () => '/api/application/nodes',
        get: (n: number) => `/api/application/nodes/${n}`,
        config: (n: number) => `/api/application/nodes/${n}/configuration`,
    },
    allocations: {
        main: (n: number) => `/api/application/nodes/${n}/allocations`,
        get: (n: number, id: number) =>
            `/api/application/nodes/${n}/allocations/${id}`,
    },
    servers: {
        main: () => '/api/application/servers',
        get: (s: number) => `/api/application/servers/${s}`,
        ext: (s: string) => `/api/application/servers/external/${s}`,
        details: (s: number) => `/api/application/servers/${s}/details`,
        build: (s: number) => `/api/application/servers/${s}/build`,
        startup: (s: number) => `/api/application/servers/${s}/startup`,
        suspend: (s: number) => `/api/application/servers/${s}/suspend`,
        unsuspend: (s: number) => `/api/application/servers/${s}/unsuspend`,
        reinstall: (s: number) => `/api/application/servers/${s}/reinstall`,
    },
    locations: {
        main: () => '/api/application/locations',
        get: (l: number) => `/api/application/locations/${l}`,
    },
    nests: {
        main: () => '/api/application/nests',
        get: (n: number) => `/api/application/nests/${n}`,
        eggs: {
            main: (n: number) => `/api/application/nests/${n}/eggs`,
            get: (n: number, e: number) =>
                `/api/application/nests/${n}/eggs/${e}`,
        },
    },
};

export const client = {
    account: {
        main: () => '/api/client/account',
        tfa: () => '/api/client/account/two-factor',
        email: () => '/api/client/account/email',
        password: () => '/api/client/account/password',
        activity: () => '/api/client/account/activity',
        apikeys: {
            main: () => '/api/client/account/api-keys',
            get: (id: string) => `/api/client/account/api-keys/${id}`,
        },
        sshkeys: {
            main: () => '/api/client/account/ssh-keys',
            remove: () => '/api/client/account/ssh-keys/remove',
        },
    },
    servers: {
        main: () => '/api/client',
        get: (s: string) => `/api/client/servers/${s}`,
        databases: {
            main: (s: string) => `/api/client/servers/${s}/databases`,
            get: (s: string, id: number) =>
                `/api/client/servers/${s}/databases/${id}`,
            rotate: (s: string, id: number) =>
                `/api/client/servers/${s}/databases/${id}/rotate-password`,
        },
        files: {
            main: (s: string) => `/api/client/servers/${s}/files/list`,
            contents: (s: string, f: string) =>
                `/api/client/servers/${s}/files/contents?file=${f}`,
            download: (s: string, f: string) =>
                `/api/client/servers/${s}/files/download?file=${f}`,
            rename: (s: string) => `/api/client/servers/${s}/files/rename`,
            copy: (s: string) => `/api/client/servers/${s}/files/copy`,
            write: (s: string, f: string) =>
                `/api/client/servers/${s}/files/write?file=${f}`,
            compress: (s: string) => `/api/client/servers/${s}/files/compress`,
            decompress: (s: string) =>
                `/api/client/servers/${s}/files/decompress`,
            delete: (s: string) => `/api/client/servers/${s}/files/delete`,
            create: (s: string) =>
                `/api/client/servers/${s}/files/create-folder`,
            chmod: (s: string) => `/api/client/servers/${s}/files/chmod`,
            pull: (s: string) => `/api/client/servers/${s}/files/pull`,
            upload: (s: string) => `/api/client/servers/${s}/files/upload`,
        },
        schedules: {
            main: (s: string) => `/api/client/servers/${s}/schedules`,
            get: (s: string, id: number) =>
                `/api/client/servers/${s}/schedules/${id}`,
            tasks: {
                main: (s: string, id: number) =>
                    `/api/client/servers/${s}/schedules/${id}/tasks`,
                get: (s: string, id: number, t: number) =>
                    `/api/client/servers/${s}/schedules/${id}/tasks/${t}`,
            },
        },
        network: {
            main: (s: string) => `/api/client/servers/${s}/network/allocations`,
            get: (s: string, id: number) =>
                `/api/client/servers/${s}/network/allocations/${id}`,
            primary: (s: string, id: number) =>
                `/api/client/servers/${s}/network/allocations/${id}/primary`,
        },
        users: {
            main: (s: string) => `/api/client/servers/${s}/users`,
            get: (s: string, id: number) =>
                `/api/client/servers/${s}/users/${id}`,
        },
        backups: {
            main: (s: string) => `/api/client/servers/${s}/backups`,
            get: (s: string, id: number) =>
                `/api/client/servers/${s}/backups/${id}`,
            download: (s: string, id: number) =>
                `/api/client/servers/${s}/backups/${id}/download`,
        },
        startup: {
            get: (s: string) => `/api/client/servers/${s}/startup`,
            var: (s: string) => `/api/client/servers/${s}/startup/variable`,
        },
        settings: {
            rename: (s: string) => `/api/client/servers/${s}/settings/rename`,
            reinstall: (s: string) =>
                `/api/client/servers/${s}/settings/reinstall`,
        },
        ws: (s: string) => `/api/client/servers/${s}/websocket`,
        resources: (s: string) => `/api/client/servers/${s}/resources`,
        activity: (s: string) => `/api/client/servers/${s}/activity`,
        command: (s: string) => `/api/client/servers/${s}/command`,
        power: (s: string) => `/api/client/servers/${s}/power`,
    },
    main: () => '/api/client',
    permissions: () => '/api/client/permissions',
};

export default {
    application,
    client,
};
