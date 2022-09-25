import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseUrls } from 'src/app/base-urls';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  loader: boolean = false;
  user: Users = JSON.parse(localStorage.getItem('user') || '{}');

  userForm: FormGroup = new FormGroup({
    userId: new FormControl(this.user.userId),
    email: new FormControl(this.user.email),
    password: new FormControl(this.user.password),
    fullName: new FormControl(this.user.fullName),
    street: new FormControl(this.user.street),
    city: new FormControl(this.user.city),
    state: new FormControl(this.user.state),
    country: new FormControl(this.user.country),
    pincode: new FormControl(this.user.pincode),
    image: new FormControl(this.user.image),
    contact: new FormControl(this.user.contact)
  })

  constructor(
    private httpClient: HttpClient,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {}

  updateProfile() {
    this.loader = true;
    let formData: FormData = new FormData();
    Object.entries(this.userForm.value).forEach(([key, value]: [string, any], idx: number) => {
      formData.append(key, value);
    });

    this.httpClient.post(BaseUrls.getUpdateUrl(BaseUrls.USER_GROUPURL), formData)
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.loader = false;
          localStorage.setItem("user", JSON.stringify(data[0]));
          this.toast.success("Profile Updated", "Success")
        },
        error: (error) => {
          // console.log(error);
          this.toast.warning("Something Went Wrong!! Please Again...", "Failed");
          this.loader = false;
        },
      })
  }
}
