import {makeAutoObservable} from "mobx"
import Mark from "./Mark"
import State from "./State"
import { useContext } from "react"
import { Context } from "../index"

export default class TextWiki{
    constructor(){
        this._group = []
        this._text = []
        this._selectedGroup = {};
        this._selectedUser = {};

        this._page = 1
        this._totalCount = 0
        this._limit = 3
        makeAutoObservable(this)
    }

    setPage(page){
        this._page = page
    }

    setTotalCount(count){
        this._totalCount = count
    }

    setLimit(limit){
        this._limit = limit
    }

    setSelectedGroup(group){
        this._page = 1
        this._selectedGroup = group
    }

    setSelectedUser(user){
        this._page = 1
        this._selectedUser = user
    }

    setGroup(group){
        this._group = group
    }
    setText(splitText, masMark){
        const text = splitText.map(temp => 
            temp = {id: temp.id, state: new State(temp.id, temp.title, temp.text),
                userId: temp.userId, userName: temp.user.fn + ' ' + temp.user.sn,
                group: {id: temp.groupId, name: temp.group.name}, mark: new Mark(temp.id, temp.mark,  masMark.findIndex(mark => mark == temp.id) != -1)}
        )
        this._text = text
    }

    addText(temp, userName, groupName){
        const obj =  {id: temp.id, state: new State(temp.id, temp.title, temp.text),
            userId: temp.userId, userName: userName,
            group: {id: temp.groupId, name: groupName}, mark: new Mark(temp.id, 0,false)}
        this._text.push(obj)
    }

    delTextId(id){
        this._text = this._text.filter(text => text.id != id)
    }

    get groups(){
        return this._group
    }

    get texts(){
        return this._text
    }

    get selectedGroup(){
        return this._selectedGroup
    }

    get selectedUser(){
        return this._selectedUser
    }

    get page(){
        return this._page
    }

    get totalCount(){
        return this._totalCount
    }

    get limit(){
        return this._limit
    }
}