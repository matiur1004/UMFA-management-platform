import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardResolver } from './dashboard.resolvers';

export const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        resolve  : {
            data: DashboardResolver
        }
    },
    {
        path     : 'alarm-triggered/:id',
        component: DashboardComponent,
        resolve  : {
            data: DashboardResolver
        }
    }
];
