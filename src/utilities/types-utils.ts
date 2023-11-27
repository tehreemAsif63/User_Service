export type MessageData={ [key: string]: unknown }&{requestInfo:{user:{admin:boolean,id:string,email:string,userType:string}}};
export type MessagePayload={responseTopic:string,payload:MessageData}
export type MessageHandler= (data:MessageData) => Promise<unknown>;
