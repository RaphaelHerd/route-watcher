import { Component } from '@angular/core';
import {Login} from "./models/login";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'route-watcher';

  loginInfo:Login = {
    avatar:'route-logo.jpg',
    title:'Senior Developer'
};
}
