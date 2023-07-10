export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string
    isAdmin: boolean
}

export type CurrentUser = {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export type LoginMutation = {
    email: string;
    password: string;
}

export type SingupData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birthday: Date;
}