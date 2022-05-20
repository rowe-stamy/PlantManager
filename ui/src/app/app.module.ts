import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from 'src/app/redux';
import { CommandEffects } from 'src/app/redux/commands.effects';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExtractionComponent } from './extraction/extraction.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PlantCreateComponent } from './plants/plant-create/plant-create.component';
import { PlantDetailsComponent } from './plants/plant-details/plant-details.component';
import { PlantsComponent } from './plants/plants.component';
import { MatMenuModule } from '@angular/material/menu';
import { PlantRenameComponent } from './plants/plant-details/plant-rename/plant-rename.component';
import { ResponsiveGridDirective } from 'src/app/responsive-grid.directive';
import { MatGridListModule } from '@angular/material/grid-list';
import { ExtractionPlantComponent } from './extraction/extraction-plant/extraction-plant.component';
import { ExtractionFractionComponent } from './extraction/extraction-plant/extraction-fraction/extraction-fraction.component';
import { ExtractionsTableComponent } from './extraction/extractions-table/extractions-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '7b43f6f9-9ee0-4895-bef5-79e442baa4c4',
      authority: 'https://login.microsoftonline.com/3eacc9db-51a4-4822-80da-6fa7df33c45c',
      redirectUri: environment.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  });
}


export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  protectedResourceMap.set(environment.apiUri + '*', ['api://7b43f6f9-9ee0-4895-bef5-79e442baa4c4/User.Read']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect };
}

@NgModule({
  declarations: [
    AppComponent,
    ExtractionComponent,
    NavigationComponent,
    PlantsComponent,
    PlantCreateComponent,
    PlantDetailsComponent,
    PlantRenameComponent,
    ResponsiveGridDirective,
    ExtractionPlantComponent,
    ExtractionFractionComponent,
    ExtractionsTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,

    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    MsalModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatChipsModule,

    EffectsModule.forRoot([CommandEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 50, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: false,
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
