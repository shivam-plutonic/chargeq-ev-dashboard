import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MaterialModule } from '../../app.module';
import { ComponentModule } from '../../shared/component/component.module';
import { DialogsModule } from '../../shared/dialogs/dialogs.module';
import { CommonDirectivesModule } from '../../shared/directives/directives.module';
import { FormattersModule } from '../../shared/formatters/formatters.module';
import { TableModule } from '../../shared/table/table.module';
import {DashboardRoutes} from './dashboard.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    TranslateModule,
    MaterialModule,
    TableModule,
    CommonDirectivesModule,
    DialogsModule,
    MatProgressBarModule,
    FormattersModule,
    ComponentModule,
    MomentModule,
    NgbModule
  ],
  declarations: [
  ],
  providers: [
  ]
})
export class DashboardModule {
}
