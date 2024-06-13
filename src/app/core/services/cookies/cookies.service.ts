import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  private _accepted: boolean = true;
  public get accepted(): boolean {
    return this._accepted;
  }
  public set accepted(value: boolean) {
    this._accepted = value;
    console.log('ACCEPT COOKIES?:',value)
  }

  constructor() { }
}
