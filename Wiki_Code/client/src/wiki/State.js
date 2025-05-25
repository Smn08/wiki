import {makeAutoObservable} from "mobx"

export default class State{
    constructor(id,title,text){
        this._id = id;
        this._title = title;
        this._text = text
        makeAutoObservable(this)
    }


    setId(id){
        this._id = id
    }

    setTitle(title){
        this._title = title
    }

    setText(text){
        this._text = text
    }

    get id(){
        return this._id
    }

    get title(){
        return this._title
    }

    get text(){
        return this._text
    }
}