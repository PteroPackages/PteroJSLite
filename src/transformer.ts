import caseConv from './conversions';

function fromAttributes<T>(data: { [key: string]: any }): T {
    let res = {} as T;
    for (let [k, v] of Object.entries<any>(data)) {
        if (
            typeof v === 'object' &&
            !Array.isArray(v) &&
            !!v
        ) v = caseConv.toCamelCase(v);
        if (['created_at', 'updated_at'].includes(k) && v) v = Date.parse(v);
        res[caseConv.camelCase(k)] = v ?? undefined;
    }
    return res;
}

function fromData<T>(data: { [key: string]: any }[]): T[] {
    return data.map<T>(d => fromAttributes(d.attributes));
}

function intoJSON(data: any): { [key: string]: any } {
    let res: { [key: string]: any } = {};
    for (let [k, v] of Object.entries(data)) {
        if (
            typeof v === 'object' &&
            !Array.isArray(v) &&
            !!v
        ) v = caseConv.toSnakeCase(v);
        if (
            !['string', 'number', 'boolean'].includes(typeof v) &&
            !!v
        ) v = String(v);
        res[caseConv.snakeCase(k)] = v ?? null;
    }
    return res;
}

export default {
    fromAttributes,
    fromData,
    intoJSON
}
