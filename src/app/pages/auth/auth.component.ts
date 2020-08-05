import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {
    if(this.userService.getLocalUser() !== null){
      router.navigate(['/']);
    } 
   }

  ngOnInit(): void {
  }

}
