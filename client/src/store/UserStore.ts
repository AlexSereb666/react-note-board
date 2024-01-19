import { makeAutoObservable } from 'mobx';

interface IUser {
    login?: string;
}

export default class UserStore {
    private _isAuth: boolean = false;
    private _user: IUser = {};

    constructor() {
        makeAutoObservable(this);
    }

    setIsAuth(bool: boolean): void {
        this._isAuth = bool;
    }

    setUser(user: IUser): void {
        this._user = user;
    }

    get isAuth(): boolean {
        return this._isAuth;
    }

    get user(): IUser {
        return this._user;
    }

    get userLogin(): string {
        return this._user.login || '';
    }
}
