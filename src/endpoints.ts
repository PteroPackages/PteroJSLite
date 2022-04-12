export const application = {
    users:{
        main: () => '/api/application/users',
        get: (u: number) => `/api/application/users/${u}`,
        ext: (u: number) => `/api/application/users/external/${u}`
    },
    nodes:{
        main: () => '/api/application/nodes',
        get: (n: number) => `/api/application/nodes/${n}`,
        config: (n: number) => `/api/application/nodes/${n}/configuration`
    },
    servers:{
        main: () => '/api/application/servers',
        get: (s: number) => `/api/application/servers/${s}`,
        ext: (s: number) => `/api/application/servers/external/${s}`,
        details: (s: number) => `/api/application/servers/${s}/details`,
        build: (s: number) => `/api/application/servers/${s}/build`,
        startup: (s: number) => `/api/application/servers/${s}/startup`,
        suspend: (s: number) => `/api/application/servers/${s}/suspend`,
        unsuspend: (s: number) => `/api/application/servers/${s}/unsuspend`,
        reinstall: (s: number) => `/api/application/servers/${s}/reinstall`
    },
    locations:{
        main: () => '/api/application/locations',
        get: (l: number) => `/api/application/locations/${l}`
    },
    nests:{
        main: () => '/api/application/nests',
        get: (n: number) => `/api/application/nests/${n}`,
        eggs:{
            main: (n: number) => `/api/application/nests/${n}/eggs`,
            get: (n: number, e: number) => `/api/application/nests/${n}/eggs/${e}`
        }
    }
}

export const client = {
    account:{
        main: () => '/api/client/account',
        tfa: () => '/api/client/account/two-factor',
        email: () => '/api/client/account/email',
        password: () => '/api/client/account/password',
        apikeys: () => '/api/client/account/api-keys'
    },
    servers:{
        main: () => '/api/client/servers',
        get: (s: number) => `/api/client/servers/${s}`,
        databases:{
            main: (s: number) => `/api/client/servers/${s}/databases`,
            get: (s: number, id: number) => `/api/client/servers/${s}/databases/${id}`,
            rotate: (s: number, id: number) => `/api/client/servers/${s}/databases/${id}/rotate-password`
        },
        files:{
            main: (s: number) => `/api/client/servers/${s}/files/list`,
            contents: (s: number, f: number) => `/api/client/servers/${s}/files/contents?file=${f}`,
            download: (s: number, f: number) => `/api/client/servers/${s}/files/download?file=${f}`,
            rename: (s: number) => `/api/client/servers/${s}/files/rename`,
            copy: (s: number) => `/api/client/servers/${s}/files/copy`,
            write: (s: number, f: number) => `/api/client/servers/${s}/files/write?file=${f}`,
            compress: (s: number) => `/api/client/servers/${s}/files/compress`,
            decompress: (s: number) => `/api/client/servers/${s}/files/decompress`,
            delete: (s: number) => `/api/client/servers/${s}/files/delete`,
            create: (s: number) => `/api/client/servers/${s}/files/create-folder`,
            upload: (s: number) => `/api/client/servers/${s}/files/upload`
        },
        schedules:{
            main: (s: number) => `/api/client/servers/${s}/schedules`,
            get: (s: number, id: number) => `/api/client/servers/${s}/schedules/${id}`,
            tasks:{
                main: (s: number, id: number) => `/api/client/servers/${s}/schedules/${id}/tasks`,
                get: (s: number, id: number, t: number) => `/api/client/servers/${s}/schedules/${id}/tasks/${t}`
            }
        },
        network:{
            main: (s: number) => `/api/client/servers/${s}/network/allocations`,
            get: (s: number, id: number) => `/api/client/servers/${s}/network/allocations/${id}`,
            primary: (s: number, id: number) => `/api/client/servers/${s}/network/allocations/${id}/primary`
        },
        users:{
            main: (s: number) => `/api/client/servers/${s}/users`,
            get: (s: number, id: number) => `/api/client/servers/${s}/users/${id}`
        },
        backups:{
            main: (s: number) => `/api/client/servers/${s}/backups`,
            get: (s: number, id: number) => `/api/client/servers/${s}/backups/${id}`,
            download: (s: number, id: number) => `/api/client/servers/${s}/backups/${id}/download`
        },
        startup:{
            get: (s: number) => `/api/client/servers/${s}/startup`,
            var: (s: number) => `/api/client/servers/${s}/startup/variable`
        },
        settings:{
            rename: (s: number) => `/api/client/servers/${s}/settings/rename`,
            reinstall: (s: number) => `/api/client/servers/${s}/settings/reinstall`
        },
        ws: (s: number) => `/api/client/servers/${s}/websocket`,
        resources: (s: number) => `/api/client/servers/${s}/resources`,
        command: (s: number) => `/api/client/servers/${s}/command`,
        power: (s: number) => `/api/client/servers/${s}/power`
    },
    main: () => '/api/client',
    permissions: () => '/api/client/permissions'
}

export default {
    application,
    client
}
