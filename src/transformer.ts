import caseConv from './conversions';

function fromAttributes<T>(data: Record<string, any>): T {
    let res = {} as Record<string, any>;
    for (let [k, v] of Object.entries<any>(data)) {
        if (
            typeof v === 'object' &&
            !Array.isArray(v) &&
            !!v
        ) v = caseConv.toCamelCase(v);
        if (
            ['created_at', 'updated_at', 'last_used_at'].includes(k) && v
        ) v = Date.parse(v);
        res[caseConv.camelCase(k)] = v ?? undefined;
    }
    return res as T;
}

function fromData<T>(data: Record<string, any>[]): T[] {
    return data.map<T>(d => fromAttributes(d.attributes));
}

function intoJSON(data: any): Record<string, any> {
    let res: Record<string, any> = {};
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
