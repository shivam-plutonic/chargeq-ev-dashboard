import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';

import { AppDayPipe } from '../../../../shared/formatters/app-day.pipe';
import PricingDefinition from '../../../../types/Pricing';
import { Constants } from '../../../../utils/Constants';
import { PricingHelpers } from '../../../../utils/PricingHelpers';

@Component({
  selector: 'app-pricing-definition-restrictions',
  templateUrl: './pricing-definition-restrictions.component.html',
})

export class PricingDefinitionRestricitionsComponent implements OnInit, OnChanges {
  @Input() public formGroup!: FormGroup;
  @Input() public currentPricingDefinition: PricingDefinition;

  public minTime: string;
  // Restrictions
  public restrictions!: FormGroup;
  // Duration
  public minDurationEnabled: AbstractControl;
  public minDuration: AbstractControl;
  public maxDurationEnabled: AbstractControl;
  public maxDuration: AbstractControl;
  // Energy KWh
  public minEnergyKWhEnabled: AbstractControl;
  public minEnergyKWh: AbstractControl;
  public maxEnergyKWhEnabled: AbstractControl;
  public maxEnergyKWh: AbstractControl;
  // Days of week
  public daysOfWeekEnabled: AbstractControl;
  public selectedDays: AbstractControl;
  public daysOfTheWeek = [1, 2, 3, 4, 5, 6, 7];
  // Start/end date time
  public timeRangeEnabled: AbstractControl;
  public timeFrom: AbstractControl;
  public timeTo: AbstractControl;

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public translateService: TranslateService,
    public dayPipe: AppDayPipe) {
  }

  public ngOnInit(): void {
    this.formGroup.addControl('restrictions', new FormGroup({
      minDurationEnabled: new FormControl(false),
      minDuration: new FormControl(null, Validators.pattern(Constants.REGEX_VALIDATION_NUMBER)),
      maxDurationEnabled: new FormControl(false),
      maxDuration: new FormControl(null, Validators.pattern(Constants.REGEX_VALIDATION_NUMBER)),
      minEnergyKWhEnabled: new FormControl(false),
      minEnergyKWh: new FormControl(null, Validators.pattern(Constants.REGEX_VALIDATION_NUMBER)),
      maxEnergyKWhEnabled: new FormControl(false),
      maxEnergyKWh: new FormControl(null, Validators.pattern(Constants.REGEX_VALIDATION_NUMBER)),
      timeRangeEnabled: new FormControl(false),
      timeFrom: new FormControl(null),
      timeTo: new FormControl(null),
      daysOfWeekEnabled: new FormControl(false),
      selectedDays: new FormControl(null),
    }));
    this.restrictions = this.formGroup.controls['restrictions'] as FormGroup;
    this.minDurationEnabled = this.restrictions.controls['minDurationEnabled'];
    this.minDuration = this.restrictions.controls['minDuration'];
    this.maxDurationEnabled = this.restrictions.controls['maxDurationEnabled'];
    this.maxDuration = this.restrictions.controls['maxDuration'];
    this.minEnergyKWhEnabled = this.restrictions.controls['minEnergyKWhEnabled'];
    this.minEnergyKWh = this.restrictions.controls['minEnergyKWh'];
    this.maxEnergyKWhEnabled = this.restrictions.controls['maxEnergyKWhEnabled'];
    this.maxEnergyKWh = this.restrictions.controls['maxEnergyKWh'];
    this.daysOfWeekEnabled = this.restrictions.controls['daysOfWeekEnabled'];
    this.selectedDays = this.restrictions.controls['selectedDays'];
    this.timeRangeEnabled = this.restrictions.controls['timeRangeEnabled'];
    this.timeFrom = this.restrictions.controls['timeFrom'];
    this.timeTo = this.restrictions.controls['timeTo'];
    this.timeFrom.valueChanges.subscribe(() => {
      if(this.timeTo.value && this.timeFrom.value === this.timeTo.value){
        this.timeFrom.setErrors({timeRangeError: true});
        this.formGroup.markAsPristine();
      }
    });
    this.timeTo.valueChanges.subscribe(() => {
      if(this.timeFrom.value && this.timeFrom.value === this.timeTo.value){
        this.timeTo.setErrors({timeRangeError: true});
        this.formGroup.markAsPristine();
      }
    });
    this.formGroup.updateValueAndValidity();
    this.loadPricing();
  }

  public ngOnChanges(): void {
    // Load
    this.loadPricing();
  }

  public loadPricing() {
    if (this.currentPricingDefinition) {
      // Restrictions
      this.daysOfWeekEnabled.setValue(!!this.currentPricingDefinition.restrictions?.daysOfWeek);
      this.selectedDays.setValue(this.currentPricingDefinition.restrictions?.daysOfWeek?.map((day) => day.toString()) || null);
      this.timeRangeEnabled.setValue(!!this.currentPricingDefinition.restrictions?.timeFrom);
      this.timeFrom.setValue(this.currentPricingDefinition.restrictions?.timeFrom);
      this.minTime = this.currentPricingDefinition.restrictions?.timeTo;
      this.timeTo.setValue(this.currentPricingDefinition.restrictions?.timeTo);
      this.minDurationEnabled.setValue(!!this.currentPricingDefinition.restrictions?.minDurationSecs);
      this.minDuration.setValue(PricingHelpers.toMinutes(this.currentPricingDefinition.restrictions?.minDurationSecs));
      this.maxDurationEnabled.setValue(!!this.currentPricingDefinition.restrictions?.maxDurationSecs);
      this.maxDuration.setValue(PricingHelpers.toMinutes(this.currentPricingDefinition.restrictions?.maxDurationSecs));
      this.minEnergyKWhEnabled.setValue(!!this.currentPricingDefinition.restrictions?.minEnergyKWh);
      this.minEnergyKWh.setValue(this.currentPricingDefinition.restrictions?.minEnergyKWh);
      this.maxEnergyKWhEnabled.setValue(!!this.currentPricingDefinition.restrictions?.maxEnergyKWh);
      this.maxEnergyKWh.setValue(this.currentPricingDefinition.restrictions?.maxEnergyKWh);
      // Force refresh the form
      this.formGroup.updateValueAndValidity();
      this.formGroup.markAsPristine();
      this.formGroup.markAllAsTouched();
    }
  }

  public toggleDaysOfWeek(event: MatSlideToggleChange) {
    this.daysOfWeekEnabled.setValue(event.checked);
    if(event.checked) {
      this.selectedDays.setValidators(Validators.required);
    } else {
      this.clearAndResetControl(this.selectedDays);
    }
    this.formGroup.markAsDirty();
    this.formGroup.updateValueAndValidity();
  }

  public toggleTimeRange(event: MatSlideToggleChange) {
    this.timeRangeEnabled.setValue(event.checked);
    if (event.checked) {
      this.timeFrom.setValidators(Validators.required);
      this.timeTo.setValidators(Validators.required);
    } else {
      this.clearAndResetControl(this.timeFrom);
      this.clearAndResetControl(this.timeTo);
    }
    this.timeFrom.markAsDirty();
    this.timeTo.markAsDirty();
    this.timeFrom.updateValueAndValidity();
    this.timeTo.updateValueAndValidity();
  }

  public toggleDuration(event: MatSlideToggleChange) {
    this[`${event.source.id}Enabled`].setValue(event.checked);
    if (event.checked) {
      this[event.source.id].setValidators(Validators.compose([
        Validators.required,
        Validators.pattern(Constants.REGEX_VALIDATION_FLOAT),
        PricingHelpers.minMaxValidator(this.formGroup, 'minDuration', 'maxDuration')
      ]));
    } else {
      this.clearAndResetControl(this[`${event.source.id}`]);
    }
    this.formGroup.markAsDirty();
    this.formGroup.updateValueAndValidity();
  }

  public toggleEnergy(event: MatSlideToggleChange) {
    this[`${event.source.id}Enabled`].setValue(event.checked);
    if (event.checked) {
      this[event.source.id].setValidators(Validators.compose([
        Validators.required,
        Validators.pattern(Constants.REGEX_VALIDATION_FLOAT),
        PricingHelpers.minMaxValidator(this.formGroup, 'minEnergyKWh', 'maxEnergyKWh')
      ]));
    } else {
      this.clearAndResetControl(this[`${event.source.id}`]);
    }
    this.formGroup.markAsDirty();
    this.formGroup.updateValueAndValidity();
  }

  private clearAndResetControl(control: AbstractControl) {
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity();
  }
}
