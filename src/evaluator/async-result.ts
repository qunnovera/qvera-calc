export class AsyncResult {

  tempValue: any;
  awaiter: Promise<any>;

  constructor(tempValue: any, awaiter: Promise<any>){
    this.tempValue = tempValue;
    this.awaiter = awaiter;
  }

}
