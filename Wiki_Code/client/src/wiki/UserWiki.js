import {makeAutoObservable} from "mobx"
export default class UserWiki{
    constructor(){
        this._id = null;
        this._isAuth = false;
        this._isAdmin = false;
        this._user = {};
        this._img = '';
        this._isInitialized = false;
        makeAutoObservable(this)
    }

    setImg(img) {
        this._img = img
    }

    setIsAuth(bool){
        this._isAuth = bool
    }

    setIsAdmin(bool){
        this._isAdmin = bool
    }

    setUser(userData){
        if (userData) {
            this._id = userData.id || null;
            this._isAuth = true;
            this._isAdmin = userData.role === 'ADMIN';
            this._user = userData;
            this._img = userData.foto || '';
        } else {
            this._id = null;
            this._isAuth = false;
            this._isAdmin = false;
            this._user = {};
            this._img = '';
        }
    }

    setId(id){
        this._id = id
    }

    setIsInitialized(bool) {
        this._isInitialized = bool;
    }

    get isAuth(){
        return this._isAuth
    }

    get user(){
        return this._user
    }

    get isAdmin(){
        return this._isAdmin
    }

    get id(){
        return this._id
    }

    get img(){
        return this._img
    }

    get isInitialized() {
        return this._isInitialized;
    }
}