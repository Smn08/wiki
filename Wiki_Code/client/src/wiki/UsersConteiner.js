import {makeAutoObservable} from "mobx"
import UserProfil from "./UserProfil";


export default class UsersConteiner{
    constructor(){
        this._users = [];
        this.restart = false
        makeAutoObservable(this)
    }

    setUsers(users){

        users = users.map(temp => temp = {
            id: temp.id,
            user: new UserProfil(temp.id,temp.fn,temp.sn,temp.foto,temp.email,4,111,temp.role == 'ADMIN',temp.text) }
        )
        this._users = users
    }

    get users(){
        return this._users
    }
    
    setRole(id, role){
        this._users.find(teck => teck.id == id).user.setIsAdmin(role)
    }

    img(id){
        
        let temp = this._users.find(us => us.id == id)
        if (!temp){
            console.log(this._users)
        }
        return temp.user.img
    }


}