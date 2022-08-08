export interface Account {
    id:         number;
    admin:      boolean;
    username:   string;
    email:      string;
    firstName:  string;
    lastName:   string;
    language:   string;
}

export interface APIKey {
    identifier:     string;
    description:    string;
    allowedIps:     string[];
    createdAt:      number;
    lastUsedAt:     number;
}

export interface PermissionDescriptor {
    description:    string;
    keys:           Record<string, string>;
}

export interface TwoFactorData {
    imageURLData:   string;
    secret:         string;
}
