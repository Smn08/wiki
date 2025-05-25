import {makeAutoObservable} from "mobx"
export default class UserWiki{
    constructor(){
        this._id = 0;
        this._isAuth = {}
        this._isAdmin = {}
        this._user = {}
        this._img = {}
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

    setUser(user){
        this._user = user
    }

    setId(id){
        this._id = id
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
}