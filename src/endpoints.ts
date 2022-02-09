export type PathGetter = {
    [key: string]: ((...params: string[]) => string) | PathGetter
}

export const application: PathGetter = {
    users:{
        main: () => '/api/application/users',
        get: u => `/api/application/users/${u}`,
        ext: u => `/api/application/users/external/${u}`
    },
    nodes:{
        main: () => '/api/application/nodes',
        get: n => `/api/application/nodes/${n}`,
        config: n => `/api/application/nodes/${n}/configuration`
    },
    servers:{
        main: () => '/api/application/servers',
        get: s => `/api/application/servers/${s}`,
        ext: s => `/api/application/servers/external/${s}`,
        details: s => `/api/application/servers/${s}/details`,
        build: s => `/api/application/servers/${s}/build`,
        startup: s => `/api/application/servers/${s}/startup`,
        suspend: s => `/api/application/servers/${s}/suspend`,
        unsuspend: s => `/api/application/servers/${s}/unsuspend`,
        reinstall: s => `/api/application/servers/${s}/reinstall`
    },
    locations:{
        main: () => '/api/application/locations',
        get: l => `/api/application/locations/${l}`
    },
    nests:{
        main: () => '/api/application/nests',
        get: n => `/api/application/nests/${n}`,
        eggs:{
            main: n => `/api/application/nests/${n}/eggs`,
            get: (n, e) => `/api/application/nests/${n}/eggs/${e}`
        }
    }
}

export const client: PathGetter = {
    account:{
        main: () => '/api/client/account',
        tfa: () => '/api/client/account/two-factor',
        email: () => '/api/client/account/email',
        password: () => '/api/client/account/password',
        apikeys: () => '/api/client/account/api-keys'
    },
    servers:{
        main: () => '/api/client/servers',
        get: s => `/api/client/servers/${s}`,
        databases:{
            main: s => `/api/client/servers/${s}/databases`,
            get: (s, id) => `/api/client/servers/${s}/databases/${id}`,
            rotate: (s, id) => `/api/client/servers/${s}/databases/${id}/rotate-password`
        },
        files:{
            main: s => `/api/client/servers/${s}/files/list`,
            contents: (s, f) => `/api/client/servers/${s}/files/contents?file=${f}`,
            download: (s, f) => `/api/client/servers/${s}/files/download?file=${f}`,
            rename: s => `/api/client/servers/${s}/files/rename`,
            copy: s => `/api/client/servers/${s}/files/copy`,
            write: (s, f) => `/api/client/servers/${s}/files/write?file=${f}`,
            compress: s => `/api/client/servers/${s}/files/compress`,
            decompress: s => `/api/client/servers/${s}/files/decompress`,
            delete: s => `/api/client/servers/${s}/files/delete`,
            create: s => `/api/client/servers/${s}/files/create-folder`,
            upload: s => `/api/client/servers/${s}/files/upload`
        },
        schedules:{
            main: s => `/api/client/servers/${s}/schedules`,
            get: (s, id) => `/api/client/servers/${s}/schedules/${id}`,
            tasks:{
                main: (s, id) => `/api/client/servers/${s}/schedules/${id}/tasks`,
                get: (s, id, t) => `/api/client/servers/${s}/schedules/${id}/tasks/${t}`
            }
        },
        network:{
            main: s => `/api/client/servers/${s}/network/allocations`,
            get: (s, id) => `/api/client/servers/${s}/network/allocations/${id}`,
            primary: (s, id) => `/api/client/servers/${s}/network/allocations/${id}/primary`
        },
        users:{
            main: s => `/api/client/servers/${s}/users`,
            get: (s, id) => `/api/client/servers/${s}/users/${id}`
        },
        backups:{
            main: s => `/api/client/servers/${s}/backups`,
            get: (s, id) => `/api/client/servers/${s}/backups/${id}`,
            download: (s, id) => `/api/client/servers/${s}/backups/${id}/download`
        },
        startup:{
            get: s => `/api/client/servers/${s}/startup`,
            var: s => `/api/client/servers/${s}/startup/variable`
        },
        settings:{
            rename: s => `/api/client/servers/${s}/settings/rename`,
            reinstall: s => `/api/client/servers/${s}/settings/reinstall`
        },
        ws: s => `/api/client/servers/${s}/websocket`,
        resources: s => `/api/client/servers/${s}/resources`,
        command: s => `/api/client/servers/${s}/command`,
        power: s => `/api/client/servers/${s}/power`
    },
    main: () => '/api/client',
    permissions: () => '/api/client/permissions'
}
