import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User, UserButtonAction } from 'types/User';

import { DialogMode, DialogParams } from '../../../../types/Authorization';
import { SiteButtonAction } from '../../../../types/Site';
import { TableActionDef } from '../../../../types/Table';
import { TableAssignAction } from '../table-assign-action';

export interface TableViewAssignedSitesOfUserActionDef extends TableActionDef {
  action: (userSitesDialogComponent: ComponentType<unknown>, user: DialogParams<User>,
    dialog: MatDialog, refresh?: () => Observable<void>) => void;
}

export class TableViewAssignedSitesOfUserAction extends TableAssignAction {
  public getActionDef(): TableViewAssignedSitesOfUserActionDef {
    return {
      ...super.getActionDef(),
      id: UserButtonAction.VIEW_SITES_OF_USER,
      icon: 'people',
      name: 'users.display_sites',
      tooltip: 'general.tooltips.display_sites',
      action: this.viewAssignedSitesOfUser,
    };
  }

  private viewAssignedSitesOfUser(userSitesDialogComponent: ComponentType<unknown>, user: DialogParams<User>,
    dialog: MatDialog, refresh?: () => Observable<void>) {
    super.assign(userSitesDialogComponent, dialog, user, DialogMode.VIEW, refresh);
  }
}
