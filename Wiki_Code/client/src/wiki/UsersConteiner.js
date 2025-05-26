import {makeAutoObservable} from "mobx"
import UserProfil from "./UserProfil";


export default class UsersConteiner{
    constructor(){
        this._users = [];
        this.restart = false
        makeAutoObservable(this)
    }

    setUsers(users){
        if (!Array.isArray(users)) {
            console.error('setUsers получил не массив:', users);
            return;
        }

        this._users = users.map(temp => ({
            id: temp.id,
            user: new UserProfil(
                temp.id,
                temp.fn || '',
                temp.sn || '',
                temp.foto || '',
                temp.email || '',
                0,
                0,
                temp.role === 'ADMIN',
                temp.text || ''
            )
        }));
    }

    get users(){
        return this._users
    }
    
    setRole(id, role){
        const user = this._users.find(teck => teck.id === id);
        if (user) {
            user.user.setIsAdmin(role);
        }
    }

    img(id){
        const user = this._users.find(us => us.id === id);
        if (!user) {
            console.warn(`Пользователь с id ${id} не найден`);
            return '';
        }
        return user.user.img || '';
    }


}