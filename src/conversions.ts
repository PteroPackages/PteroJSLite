export interface ConvertOptions {
    ignore?: string[];
    map?: Record<string, string>;
    pass?: string[];
}

function camelCase(str: string): string {
    let res = '';
    let next = false;

    str.split('').forEach(c => {
        if (next) {
            next = false;
            res += c.toUpperCase();
        } else if (c === '_') {
            next = true;
        } else {
            res += c;
        }
    });

    return res;
}

function toCamelCase<T>(obj: object, options: ConvertOptions = {}): T {
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return <any>obj.map(i => toCamelCase(i));
    const parsed = {} as any;

    for (let [k, v] of Object.entries(obj)) {
        if (options.ignore?.includes(k)) continue;
        if (options.map?.[k]) k = options.map[k];

        if (!options.pass?.includes(k)) {
            if (Array.isArray(v)) {
                v = v.map(i => toCamelCase(i, options));
            } else if (typeof v === 'object' && !!v) {
                v = toCamelCase(v, options);
            }
        }

        parsed[camelCase(k)] = v;
    }

    return <T>parsed;
}

function snakeCase(str: string): string {
    let res = '';
    const isUpper = (c: string) =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').includes(c);

    str.split('').forEach(c => {
        if (isUpper(c)) res += '_';
        res += c.toLowerCase();
    });

    return res;
}

function toSnakeCase<T>(obj: object, options: ConvertOptions = {}): T {
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return <any>obj.map(i => toCamelCase(i));
    const parsed = {} as any;

    for (let [k, v] of Object.entries(obj)) {
        if (options.ignore?.includes(k)) continue;
        if (options.map?.[k]) k = options.map[k];

        if (!options.pass?.includes(k)) {
            if (Array.isArray(v)) {
                v = v.map(i => toCamelCase(i, options));
            } else if (typeof v === 'object' && !!v) {
                v = toCamelCase(v, options);
            }
        }

        parsed[snakeCase(k)] = v;
    }

    return <T>parsed;
}

export default {
    toCamelCase,
    toSnakeCase,
};
