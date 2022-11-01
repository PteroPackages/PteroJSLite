import { FeatureLimits, Limits } from '../common';

export interface CreateServerOptions {
    name: string;
    description?: string;
    externalId?: string;
    user: number;
    egg: number;
    dockerImage: string;
    startup: string;
    environment: Record<string, string>;
    skipScripts?: boolean;
    oomDisabled?: boolean;
    limits?: Partial<Limits>;
    featureLimits?: Partial<FeatureLimits>;
    allocation: {
        default: number;
        additional?: number[];
    };
    deploy: {
        locations: number[];
        portRange: string[];
        dedicatedIp: boolean;
    };
    startOnCompletion?: boolean;
}

export interface CreateUserOptions {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password?: string;
    rootAdmin?: boolean;
    externalId?: string;
}

export interface UpdateBuildOptions extends Partial<Limits & FeatureLimits> {
    allocation?: number;
    oomDisabled?: boolean;
    addAllocations?: number[];
    removeAllocations?: number[];
}

export interface UpdateDetailsOptions {
    name?: string;
    user?: number;
    externalId?: string;
    description?: string;
}

export interface UpdateStartupOptions {
    startup?: string;
    environment?: Record<string, string>;
    egg?: number;
    image?: string;
    skipScripts?: boolean;
}

export interface UpdateUserOptions extends CreateUserOptions {}
