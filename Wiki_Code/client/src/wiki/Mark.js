import {makeAutoObservable} from "mobx"
import { pushMark } from "../http/workMarkAPI";
import { delMark } from "../http/workMarkAPI";

export default class Mark{
    constructor(textId,count,isClick){
        this._textId = textId
        this._count = count;
        this._isClick = isClick;
        makeAutoObservable(this)
    }

    setCount(userId){
        if (this._isClick){
            delMark(userId, this._textId).then(data=>{
                this._count-=1;
                this._isClick = !this._isClick;
            })
        }else{
            pushMark(userId,this._textId).then(data=> {
                this._count+=1;
                this._isClick = !this._isClick;
            })
        }
    }
    
    setIsClick(isClick){
        this._isClick = isClick
    }

    get count(){
        return this._count
    }

    get isClick(){
        return this._isClick
    }
}