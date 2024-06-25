import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    imports: [
      RouterOutlet,
    ],
  })

export class AppComponent{}

