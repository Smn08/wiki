import {makeAutoObservable} from "mobx"

class user{
    constructor(id,fn,sn,img,email){
        this._id =  id;
        this._fn = fn;
        this._sn = sn;
        this._img = img;
        this._email = email;
        makeAutoObservable(this)
    }

    get id(){
        return this._id
    }

    get fn(){
        return this._fn;
    }

    get sn(){
        return this._sn;
    }

    get img(){
        return this._img
    }

    get fullName(){
        return this._sn + ' ' + this._fn
    }

    get email(){
        return  this._email
    }

    setFn(fn){
        this._fn = fn
    }

    setSn(sn){
        this._sn = sn
    }

    setImg(img){
        this._img = img
    }

    setEmail(email){
        this._email = email
    }

}

export default class UserProfil{
    constructor(id,fn,sn,img,email,mark = 0,countState = 0, isAdmin = false, text = ""){
        this._user = new user(id,fn,sn,img,email);
        this._mark = mark;
        this._countState = countState;
        this._isAdmin = isAdmin;
        this._text = text;
        makeAutoObservable(this)
    }

    setUser(user){
        this._user = user
    }

    setIsAdmin(admin){
        this._isAdmin = admin
    }
    
    setCountState(state){
        this._countState = state
    }

    setMark(mark){
        this._mark = mark
    }
    
    setText(text){
        this._text = text
    }
    
    get user(){
        return this._user
    }
    
    get mark(){
        return this._mark
    }
    
    get isAdmin(){
        return this._isAdmin
    }
    
    get text(){
        return this._text
    }

    get countState(){
        return this._countState
    }

    get id(){
        return this._user.id
    }

    setFn(fn){
        this._user.setFn(fn)
    }

    get fn(){
        return this._user.fn;
    }

    setSn(sn){
        this._user.setSn(sn)
    }

    get sn(){
        return this._user.sn;
    }

    get img(){
        return this._user.img
    }

    get email(){
        return  this._user.email
    }

    setEmail(email){
        this._user.setEmail(email)
    }

    get fullName(){
        return this._user.fullName
    }
   
}