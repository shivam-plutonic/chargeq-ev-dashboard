import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatusCodes } from 'http-status-codes';
import { ButtonAction } from 'types/GlobalType';

import { AuthorizationService } from '../../services/authorization.service';
import { CentralServerService } from '../../services/central-server.service';
import { DialogService } from '../../services/dialog.service';
import { MessageService } from '../../services/message.service';
import { SpinnerService } from '../../services/spinner.service';
import { WindowService } from '../../services/window.service';
import { HTTPError } from '../../types/HTTPError';
import { Constants } from '../../utils/Constants';
import { Utils } from '../../utils/Utils';
import {User} from "../../types/User";

declare let $: any;

@Component({
  selector: 'app-authentication-login-with-otp',
  templateUrl: 'authentication-login-with-otp.component.html',
})
export class AuthenticationLoginWithOTPComponent implements OnInit, OnDestroy {
  public formGroup: UntypedFormGroup;
  public mobile: AbstractControl;
  public returnUrl!: string;
  public otp: AbstractControl;
  public acceptEula: AbstractControl;
  public otpRequested = false;

  public tenantLogo = Constants.NO_IMAGE;

  private toggleButton: any;
  private sidebarVisible: boolean;
  private messages!: Record<string, string>;
  private subDomain: string;
  private nativeElement: Node;

  public constructor(
    private element: ElementRef,
    private centralServerService: CentralServerService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private spinnerService: SpinnerService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private windowService: WindowService,
    private translateService: TranslateService,
    private authorizationService: AuthorizationService) {
    // Reset the spinner
    this.spinnerService.hide();
    // Set
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    // Load the translated messages
    this.translateService.get('authentication', {}).subscribe((messages) => {
      this.messages = messages;
    });
    // Keep the sub-domain
    this.subDomain = this.windowService.getSubdomain();
    // Init Form
    this.formGroup = new UntypedFormGroup({
      mobile: new UntypedFormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
        ])),
      otp: new UntypedFormControl('',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{6}$'),
        ])),
      acceptEula: new UntypedFormControl('',
        Validators.compose([
          Validators.required,
        ])),
    });
    // Get controls
    this.mobile = this.formGroup.controls['mobile'];
    this.otp = this.formGroup.controls['otp'];
    this.acceptEula = this.formGroup.controls['acceptEula'];
    setTimeout(() => {
      const card = document.getElementsByClassName('card')[0];
      // After 700 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 700);
  }

  public ngOnInit() {
    this.dialog.closeAll();
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.route.snapshot.fragment) {
      this.returnUrl += `#${this.route.snapshot.fragment}`;
    }
    if (this.subDomain) {
      // Retrieve tenant's logo
      this.centralServerService.getTenantLogoBySubdomain(this.subDomain).subscribe({
        next: (tenantLogo: string) => {
          if (tenantLogo) {
            this.tenantLogo = tenantLogo;
          }
        },
        error: (error) => {
          this.spinnerService.hide();
          switch (error.status) {
            case StatusCodes.NOT_FOUND:
              this.tenantLogo = Constants.NO_IMAGE;
              break;
            default:
              Utils.handleHttpError(error, this.router, this.messageService,
                this.centralServerService, 'general.unexpected_error_backend');
          }
        }
      });
    } else {
      this.tenantLogo = Constants.MASTER_TENANT_LOGO;
    }
  }

  public sidebarToggle() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
      setTimeout(() => {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }

  public ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }

  public requestOtp(user: any) {
    // const mobileNumber = this.formGroup.get('mobileNumber').value;
    // this.spinnerService.show();
    this.centralServerService.requestOtp(user).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.otpRequested = true;
      },
      error: (error) => {
        this.spinnerService.hide();
        Utils.handleHttpError(error, this.router, this.messageService,
          this.centralServerService, 'general.unexpected_error_backend');
      }
    });
  }

  public verifyOtp(user: User) {
    // const { mobileNumber, otp } = this.formGroup.value;
    this.spinnerService.show();
    this.centralServerService.verifyOtp(user).subscribe({
      next: (result) => {
        this.spinnerService.hide();
        this.centralServerService.loginSucceeded(result.token);
        void this.router.navigateByUrl(this.returnUrl as string);
      },
      error: (error) => {
        this.spinnerService.hide();
        switch (error.status) {
          case StatusCodes.NOT_FOUND:
            this.messageService.showErrorMessage(this.messages['wrong_otp']);
            break;
          default:
            Utils.handleHttpError(error, this.router, this.messageService,
              this.centralServerService, 'general.unexpected_error_backend');
        }
      }
    });
  }

  public onSubmit(user: any) {
    if (!this.otpRequested) {
      this.requestOtp(user);
    } else {
      this.verifyOtp(user);
    }
  }
}
