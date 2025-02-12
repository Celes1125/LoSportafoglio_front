import { CurrencyType } from "../enums/currency-type";
import { Wallet } from "./wallet";

export interface Pocket {    
    _id: string,
    name: string,
    amount: number,
    currency: CurrencyType,
    creationDate: Date | null | undefined,
    lastModified: Date | null | undefined,
    wallet: Wallet,
    is_deleted: Boolean

}