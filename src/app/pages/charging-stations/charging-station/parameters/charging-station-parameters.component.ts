import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChargingStation, OCPPProtocol } from 'app/types/ChargingStation';
import { Component, Injectable, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { AuthorizationService } from '../../../../services/authorization.service';
import { ComponentService } from '../../../../services/component.service';
import { Constants } from '../../../../utils/Constants';
import { GeoMapDialogComponent } from 'app/shared/dialogs/geomap/geomap-dialog.component';
import { KeyValue } from 'app/types/GlobalType';
import { LocaleService } from '../../../../services/locale.service';
import { SiteArea } from 'app/types/SiteArea';
import { SiteAreasDialogComponent } from 'app/shared/dialogs/site-areas/site-areas-dialog.component';
import TenantComponents from 'app/types/TenantComponents';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-charging-station-parameters',
  templateUrl: './charging-station-parameters.component.html',
})
@Injectable()
export class ChargingStationParametersComponent implements OnInit, OnChanges {
  @Input() public chargingStation!: ChargingStation;
  @Input() public dialogRef!: MatDialogRef<any>;
  @Input() public formGroup: FormGroup;

  public userLocales: KeyValue[];
  public isAdmin!: boolean;

  public chargingStationURL!: AbstractControl;
  public private!: AbstractControl;
  public issuer!: AbstractControl;
  public maximumPower!: AbstractControl;
  public coordinates!: FormArray;
  public longitude!: AbstractControl;
  public latitude!: AbstractControl;
  public siteArea!: AbstractControl;
  public siteAreaID!: AbstractControl;
  public connectors!: FormArray;
  public chargePoints!: FormArray;

  public isOrganizationComponentActive: boolean;

  constructor(
    private authorizationService: AuthorizationService,
    private componentService: ComponentService,
    private translateService: TranslateService,
    private localeService: LocaleService,
    private dialog: MatDialog) {

    // Get Locales
    this.userLocales = this.localeService.getLocales();
    this.isOrganizationComponentActive = this.componentService.isActive(TenantComponents.ORGANIZATION);
  }

  public ngOnInit(): void {
    // Admin?
    this.isAdmin = this.authorizationService.isAdmin() ||
      this.authorizationService.isSiteAdmin(this.chargingStation.siteArea ?
        this.chargingStation.siteArea.siteID : '');
    // Init the form
    this.formGroup.addControl('id', new FormControl());
    this.formGroup.addControl('chargingStationURL', new FormControl('',
      Validators.compose([
        Validators.required,
        Validators.pattern(Constants.URL_PATTERN),
      ]))
    );
    this.formGroup.addControl('private', new FormControl(false));
    this.formGroup.addControl('issuer', new FormControl(false));
    this.formGroup.addControl('maximumPower', new FormControl(0,
      Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[+]?[0-9]*$'),
      ]))
    );
    this.formGroup.addControl('siteArea', new FormControl('',
      Validators.compose([
        Validators.required,
      ]))
    );
    this.formGroup.addControl('siteAreaID', new FormControl('',
      Validators.compose([
        Validators.required,
      ]))
    );
    this.formGroup.addControl('connectors', new FormArray([]));
    this.formGroup.addControl('chargePoints', new FormArray([]));
    this.formGroup.addControl('coordinates', new FormArray([
      new FormControl('',
        Validators.compose([
          Validators.max(180),
          Validators.min(-180),
          Validators.pattern(Constants.REGEX_VALIDATION_LONGITUDE),
        ])),
      new FormControl('',
        Validators.compose([
          Validators.max(90),
          Validators.min(-90),
          Validators.pattern(Constants.REGEX_VALIDATION_LATITUDE),
        ])),
      ])
    );
    // Form
    this.chargingStationURL = this.formGroup.controls['chargingStationURL'];
    this.private = this.formGroup.controls['private'];
    this.issuer = this.formGroup.controls['issuer'];
    this.maximumPower = this.formGroup.controls['maximumPower'];
    this.siteArea = this.formGroup.controls['siteArea'];
    this.siteAreaID = this.formGroup.controls['siteAreaID'];
    this.coordinates = this.formGroup.controls['coordinates'] as FormArray;
    this.connectors =  this.formGroup.controls['connectors'] as FormArray;
    this.chargePoints =  this.formGroup.controls['chargePoints'] as FormArray;
    this.longitude = this.coordinates.at(0);
    this.latitude = this.coordinates.at(1);
    this.formGroup.updateValueAndValidity();
    // Deactivate for non admin users
    if (!this.isAdmin) {
      this.private.disable();
      this.chargingStationURL.disable();
      this.latitude.disable();
      this.longitude.disable();
      this.siteArea.disable();
      this.siteAreaID.disable();
    }
    this.maximumPower.disable();
  }

  public ngOnChanges() {
    // Load values
    this.loadChargingStation();
  }

  public loadChargingStation() {
    if (this.chargingStation) {
      // Init form with values
      this.formGroup.controls.id.setValue(this.chargingStation.id);
      if (this.chargingStation.chargingStationURL) {
        this.formGroup.controls.chargingStationURL.setValue(this.chargingStation.chargingStationURL);
      }
      if (this.chargingStation.private) {
        this.formGroup.controls.private.setValue(this.chargingStation.private);
      }
      if (this.chargingStation.issuer) {
        this.formGroup.controls.issuer.setValue(this.chargingStation.issuer);
      }
      if (this.chargingStation.maximumPower) {
        this.formGroup.controls.maximumPower.setValue(this.chargingStation.maximumPower);
      }
      if (this.chargingStation.coordinates) {
        this.longitude.setValue(this.chargingStation.coordinates[0]);
        this.latitude.setValue(this.chargingStation.coordinates[1]);
      }
      if (this.chargingStation.siteAreaID) {
        this.formGroup.controls.siteAreaID.setValue(this.chargingStation.siteArea.id);
      }
      if (this.chargingStation.siteArea) {
        this.formGroup.controls.siteArea.setValue(this.chargingStation.siteArea.name);
      }
      if (!this.chargingStation.issuer) {
        this.formGroup.disable();
      }
      // URL not editable in case OCPP v1.6 or above
      if (this.chargingStation.ocppProtocol === OCPPProtocol.JSON) {
        this.chargingStationURL.disable();
      }
      this.formGroup.updateValueAndValidity();
      this.formGroup.markAsPristine();
      this.formGroup.markAllAsTouched();
    }
  }

  public connectorChanged() {
    let totalPower = 0;
    for (const connectorControl of this.connectors.controls) {
      if (connectorControl.get('power').value as number > 0) {
        totalPower += connectorControl.get('power').value as number;
      }
    }
    this.maximumPower.setValue(totalPower);
  }

  public chargePointChanged() {
  }

  public assignSiteArea() {
    if (!this.chargingStation.issuer) {
      return;
    }
    // Create the dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'transparent-dialog-container';
    dialogConfig.data = {
      title: 'chargers.assign_site_area',
      validateButtonTitle: 'general.select',
      sitesAdminOnly: true,
      rowMultipleSelection: false,
    };
    // Open
    this.dialog.open(SiteAreasDialogComponent, dialogConfig).afterClosed().subscribe((result) => {
      if (result && result.length > 0 && result[0] && result[0].objectRef) {
        this.chargingStation.siteArea = ((result[0].objectRef) as SiteArea);
        this.siteArea.setValue(this.chargingStation.siteArea.name);
        this.siteAreaID.setValue(this.chargingStation.siteArea.id);
        this.formGroup.markAsDirty();
      }
    });
  }

  public assignGeoMap() {
    // Create the dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '70vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'transparent-dialog-container';
    // Get latitud/longitude from form
    let latitude = this.latitude.value;
    let longitude = this.longitude.value;
    // If one is not available try to get from SiteArea and then from Site
    if (!latitude || !longitude) {
      const siteArea = this.chargingStation.siteArea;
      if (siteArea && siteArea.address) {
        if (siteArea.address.coordinates && siteArea.address.coordinates.length === 2) {
          latitude = siteArea.address.coordinates[1];
          longitude = siteArea.address.coordinates[0];
        } else {
          const site = siteArea.site;
          if (site && site.address && site.address.coordinates && site.address.coordinates.length === 2) {
            latitude = site.address.coordinates[1];
            longitude = site.address.coordinates[0];
          }
        }
      }
    }
    // Set data
    dialogConfig.data = {
      dialogTitle: this.translateService.instant('geomap.dialog_geolocation_title',
        { componentName: 'Charging Station', itemComponentName: this.chargingStation.id }),
      latitude,
      longitude,
      label: this.chargingStation.id ? this.chargingStation.id : '',
    };
    // disable outside click close
    dialogConfig.disableClose = true;
    // Open
    this.dialog.open(GeoMapDialogComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
      if (result) {
        if (result.latitude) {
          this.latitude.setValue(result.latitude);
          this.formGroup.markAsDirty();
        }
        if (result.longitude) {
          this.longitude.setValue(result.longitude);
          this.formGroup.markAsDirty();
        }
      }
    });
  }
}
