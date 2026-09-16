import { Routes } from '@angular/router';
const page=(page:string)=>()=>import('./features/page.component').then(m=>m.PageComponent);
export const routes: Routes = [
 {path:'',pathMatch:'full',loadComponent:page('home'),data:{page:'home'}},
 {path:'donate',loadComponent:page('donate'),data:{page:'donate'}}, {path:'programmes',loadComponent:page('programmes'),data:{page:'programmes'}},
 {path:'help',loadComponent:page('help'),data:{page:'help'}}, {path:'about',loadComponent:page('about'),data:{page:'about'}},
 {path:'partners',loadComponent:page('partners'),data:{page:'partners'}}, {path:'gallery',loadComponent:page('gallery'),data:{page:'gallery'}},
 {path:'contact',loadComponent:page('contact'),data:{page:'contact'}}, {path:'register',loadComponent:page('register'),data:{page:'register'}},
 {path:'login',loadComponent:page('login'),data:{page:'login'}}, {path:'invite',loadComponent:page('invite'),data:{page:'invite'}}, {path:'**',redirectTo:''}
];
