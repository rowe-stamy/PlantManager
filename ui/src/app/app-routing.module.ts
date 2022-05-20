import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AppComponent } from 'src/app/app.component';
import { ExtractionPlantComponent } from 'src/app/extraction/extraction-plant/extraction-plant.component';
import { ExtractionComponent } from 'src/app/extraction/extraction.component';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { PlantDetailsComponent } from 'src/app/plants/plant-details/plant-details.component';
import { PlantsComponent } from 'src/app/plants/plants.component';


const routes: Routes = [
  {
    // Needed for hash routing
    path: 'code',
    redirectTo: ''
  },
  {
    path: '',
    component: NavigationComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'extraction',
        component: ExtractionComponent,
      },
      {
        path: 'extraction/plant/:id',
        component: ExtractionPlantComponent,
      },
      {
        path: 'plants',
        component: PlantsComponent,
      },
      {
        path: 'plants/:id',
        component: PlantDetailsComponent,
      },
      {
        path: '',
        redirectTo: 'extraction',
        pathMatch: 'full'
      }
    ],
  }
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'legacy',
    useHash: true,
    // Don't perform initial navigation in iframes
    initialNavigation: !isIframe ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
