interface ConvertOptions {
    ignore?:    string[];
    map?:       { [key: string]: string };
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

function toCamelCase(obj: object, options: ConvertOptions = {}): object {
    const parsed: { [key: string]: object } = {};

    for (let [k, v] of Object.entries(obj)) {
        if (options.ignore?.includes(k)) continue;
        if (options.map?.[k]) k = options.map[k];
        parsed[camelCase(k)] = v;
    }

    return parsed;
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

function toSnakeCase(obj: object, options: ConvertOptions = {}): object {
    const parsed: { [key: string]: object } = {};

    for (let [k, v] of Object.entries(obj)) {
        if (options.ignore?.includes(k)) continue;
        if (options.map?.[k]) k = options.map[k];
        parsed[snakeCase(k)] = v;
    }

    return parsed;
}

export default {
    camelCase,
    snakeCase,
    toCamelCase,
    toSnakeCase
}
