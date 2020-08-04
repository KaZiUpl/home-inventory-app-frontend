import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.userService.logout().subscribe(
      (response: any) => {
        this.userService.removeLocalUser();
        this.router.navigate(['auth']);
      },
      (error: HttpErrorResponse) => console.log(error)
    );
  }
}
