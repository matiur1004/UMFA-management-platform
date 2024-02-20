import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from 'app/admin/users/shared/user.service';

@Pipe({
  name: 'userLogoSrc'
})
export class UserLogoSrcPipe implements PipeTransform {

  constructor(
    private userService: UserService
  ) {
  }

  transform(value: string): string {
    let src = '';
    if (value) {
      src = this.userService.getUserLogo(value);
    }
    return src;
  }
}
