import { ParserResult } from "../parser";

interface INameInfo {
  name: string;
  value: string;
  parsedValue: ParserResult;
  ctx: string;
}

type NameInfoStore = {[key: string]: INameInfo};

export class NameManager {
  private _names: NameInfoStore = {};
  private _scopedNames: {[key: string]: NameInfoStore} = {};

  // check is provided name is registered with the name manager
  hasName(name: string, ctx?: string): boolean{
    return !!this._getNameInfo(name, ctx);
  }

  private _getNameInfo(name: string, ctx?: string): INameInfo {
    let scope = this._names;
    if(ctx && this._scopedNames[ctx]){
      scope = this._scopedNames[ctx];
    }

    return scope[name] || this._names[name];
  }

}
