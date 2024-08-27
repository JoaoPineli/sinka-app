export interface Client {
    id: number;
    name: string;
    birthdate: Date;
    value: number;
    email: string;
    operator_id: number;
    created_at: Date;
}

export interface Operator {
    id: number;
    name: string;
    clients_count?: number;
    clients?: Client[];
}
