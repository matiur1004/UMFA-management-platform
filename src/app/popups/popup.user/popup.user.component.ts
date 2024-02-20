import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import {UserProfileUserViewModel} from '@models';
import {UserProfileService} from '@services';

@Component({
  selector: 'app-popup-user',
  templateUrl: './popup.user.component.html',
  styleUrls: ['./popup.user.component.less']
})
export class PopupUserComponent implements OnInit {

  @Input() profileId: string;
  @Input() user: UserProfileUserViewModel;
  @Output() remove = new EventEmitter<Event>();

  constructor(private userProfileService: UserProfileService, private router: Router) {
  }

  ngOnInit() {
  }

  onRemoveUser(event: Event) {
    this.userProfileService.getUserProfileById(this.profileId).subscribe(profile => {
      profile.users = profile.users.filter(user => user.id !== this.user.id);
      this.userProfileService.updateUserProfile(profile.id, profile).subscribe(r => {
        this.remove.emit(event);
      });
    });
  }
}
