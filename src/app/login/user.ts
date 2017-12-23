export class User {
    id: string;
    email: string;
    passwordGroup: { [key: string]: { [key: string]: string } };
    password: string;
    lastname: string;
    firstname: string;
}