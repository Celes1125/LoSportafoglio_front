import { Vendor } from './vendor';
import { CurrencyType } from "../enums/currency-type";
import { MovementType } from "../enums/movement-type";
import { Category } from './category';
import { Pocket } from './pocket';
import { Wallet } from './wallet';
import { User } from './user';

export interface Movement {
    _id: string,
    type: MovementType,
    date: Date,
    amount: number,
    currency: CurrencyType,
    notes: string | null
    user: User,
    vendor: Vendor | null,
    category: Category | null,
    fromPocket: Pocket | null,
    toPocket: Pocket | null,
    pocket: Pocket | null,
    wallet: Wallet,
    year?: string | null,
    month?: string | null
}
