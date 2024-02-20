import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {Page404Component} from './page404/page404.component';


export const routes: Routes = [
  {path: 'page404', component: Page404Component},
];


@NgModule({
  declarations: [Page404Component],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class GeneralModule {
}
