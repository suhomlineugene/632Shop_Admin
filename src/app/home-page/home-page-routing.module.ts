import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageBannersListComponent } from './home-page-banners-list/home-page-banners-list.component';

const routes: Routes = [
    {
        path: '',
        component: HomePageBannersListComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {}

