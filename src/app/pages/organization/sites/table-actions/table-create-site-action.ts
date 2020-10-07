import { MatDialog } from '@angular/material/dialog';
import { SiteDialogComponent } from 'app/pages/organization/sites/site/site-dialog.component';
import { TableCreateAction } from 'app/shared/table/actions/table-create-action';
import { SiteButtonAction } from 'app/types/Site';
import { TableActionDef } from 'app/types/Table';
import { Observable } from 'rxjs';

export interface TableCreateSiteActionDef extends TableActionDef {
  action: (dialog: MatDialog, refresh?: () => Observable<void>) => void;
}

export class TableCreateSiteAction extends TableCreateAction {
  public getActionDef(): TableCreateSiteActionDef {
    return {
      ...super.getActionDef(),
      id: SiteButtonAction.CREATE_SITE,
      action: this.createSite,
    };
  }

  private createSite(dialog: MatDialog, refresh?: () => Observable<void>) {
    super.create(SiteDialogComponent, dialog, refresh);
  }
}
