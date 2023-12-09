export type MessageData={ [key: string]: unknown };
export type RequestInfo = {
    user?: { id: string; email: string; userType: string;admin:boolean,firstName:string,lastName:string};
    requestID?:string;
  };
export type MessagePayload={responseTopic:string,payload:MessageData,requestInfo:RequestInfo};
export type MessageHandler= (data:MessageData,requestInfo:RequestInfo) => Promise<unknown>;
