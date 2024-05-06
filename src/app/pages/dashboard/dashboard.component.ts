import {Component} from '@angular/core';
import {SpinnerService} from '../../services/spinner.service';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  private language!: string;

  public constructor(
    private spinnerService: SpinnerService,
    private localeService: LocaleService,
  ) {
    this.localeService.getCurrentLocaleSubject().subscribe((locale) => {
      this.language = locale.language;
    });
  }


  // eslint-disable-next-line @angular-eslint/contextual-lifecycle,@angular-eslint/use-lifecycle-interface
  public ngOnInit(): void {
    this.spinnerService.hide();
  }
}
