import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
} from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService,
} from "@azure/msal-angular";
import { EventMessage, EventType, InteractionType } from "@azure/msal-browser";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { filter, map, shareReplay, takeUntil } from "rxjs/operators";
import { selectIsBusy } from "src/app/redux/network.reducer";

@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  @ViewChild("drawer") drawer: MatSidenav;

  isHandset$: Observable<{ value: boolean }>;

  userName$: Observable<string>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private store: Store<any>
  ) {}

  isIframe = false;
  loggedIn = false;
  isBusy$: Observable<boolean>;
  private readonly _destroying$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngOnInit(): void {
    this.isBusy$ = this.store.pipe(select(selectIsBusy));
    this.isIframe = window !== window.parent && !window.opener;
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => ({ value: result.matches })),
      shareReplay()
    );
    this.checkAccount();

    this.userName$ = this.msalBroadcastService.msalSubject$.pipe(
      map((result) => result?.payload?.account?.username)
    );

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result) => {
        this.checkAccount();
      });
  }

  checkAccount() {
    this.loggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService
          .loginPopup({ ...this.msalGuardConfig.authRequest } as any)
          .subscribe(() => this.checkAccount());
      } else {
        this.authService.loginPopup().subscribe(() => this.checkAccount());
      }
    } else {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginRedirect({
          ...this.msalGuardConfig.authRequest,
        } as any);
      } else {
        this.authService.loginRedirect();
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  closeMenuOnSelection(isHandset: boolean) {
    if (isHandset) {
      this.toggleDrawer();
    }
  }

  toggleDrawer() {
    if (this.drawer == null) {
      return;
    }

    this.drawer.toggle();
  }
}
