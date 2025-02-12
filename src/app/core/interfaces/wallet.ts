import { User } from "./user"

export interface Wallet {
    _id:string | null | undefined
    name:string | null | undefined
    creationDate: Date | null | undefined
    lastModified: Date | null | undefined    
    users: User[],
    is_deleted: Boolean
  
}
