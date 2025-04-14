
export interface EmailDetails{
    recipient:string;
    msgBody:string;
    subject:string;
    attachment:Uint8Array | null;
}