import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserDataService } from '@core-services/user-data/user-data.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
      RouterOutlet,
      MarkdownModule,
    ],
  })

export class AppComponent{
  constructor(public userData: UserDataService){}
}

