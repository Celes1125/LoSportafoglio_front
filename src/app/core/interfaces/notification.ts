export interface Notification {
    _id: string,
    senderUser: any,
    wallet: any,
    receiverEmail: string,
    type:string,
    status:string,
    createdAt: Date,
    is_deleted: Boolean,
    receiverUser:any

}
