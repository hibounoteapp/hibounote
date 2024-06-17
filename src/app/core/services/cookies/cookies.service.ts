import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  private _accepted: boolean = false;
  public get accepted(): boolean {
    return this._accepted;
  }
  public set accepted(value: boolean) {
    this.cookieService.set('accept-cookies',JSON.stringify(value))
    this._accepted = value;
  }

  constructor(protected cookieService: CookieService) {
    try {
      this.accepted = JSON.parse(cookieService.get("accept-cookies"))
    } catch (error) {}
  }
}
