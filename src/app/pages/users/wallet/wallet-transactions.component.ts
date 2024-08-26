// import { Component, Input, OnInit } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import {User} from '../../../types/User';
// import {CentralServerService} from '../../../services/central-server.service';
//
// @Component({
//   selector: 'app-wallet-transactions',
//   templateUrl: './wallet-transactions.component.html',
//   // styleUrls: ['./wallet-transactions.component.css']
// })
// export class WalletTransactionsComponent implements OnInit {
//   @Input() formGroup!: FormGroup;
//   @Input() wallet: any;
//   @Input() userId!: string;
//   transactions: any[] = [];
//
//
//   public user!: User;
//   constructor(private centralServerService: CentralServerService) {}
//
//
//   ngOnInit() {
//     // Initialize transactions if needed
//     this.fetchWalletTransaction();
//   }
//   fetchWalletTransaction() {
//     // const filterValues = this.buildFilterValues();
//     this.centralServerService.getWalletTransaction(this.userId).subscribe(
//       (data) => {
//         this.transactions = data; // Adjust based on your API response
//         console.log('Transaction history:', this.transactions);
//       },
//       (error) => {
//         console.error('Error fetching wallet transaction history:', error);
//       }
//     );
//   }
// }
// // import { Component } from '@angular/core';
// //
// // import { TagsListTableDataSource } from './wallet-transactions-table-data-source';
// //
// @Component({
// //   selector: 'app-tags-list',
// //   template: '<app-table [dataSource]="tagsListTableDataSource"></app-table>',
// //   providers: [TagsListTableDataSource],
// // })
// // export class TagsListComponent {
// //   // eslint-disable-next-line no-useless-constructor
// //   public constructor(
// //     public tagsListTableDataSource: TagsListTableDataSource
// //   ) {}
// // }
// //

//
// import { Component, Input, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder } from '@angular/forms';
// import { User } from '../../../types/User';
// import { CentralServerService } from '../../../services/central-server.service';
//
// @Component({
//   selector: 'app-wallet-transactions',
//   templateUrl: './wallet-transactions.component.html',
//   // styleUrls: ['./wallet-transactions.component.css']
// })
// export class WalletTransactionsComponent implements OnInit {
//   @Input() formGroup!: FormGroup;
//   @Input() wallet: any;
//   @Input() userId!: string;
//   transactions: any[] = [];
//   filterForm: FormGroup;
//
//   public user!: User;
//   constructor(
//     private centralServerService: CentralServerService,
//     private fb: FormBuilder
//   ) {
//     this.filterForm = this.fb.group({
//       startDate: [''],
//       endDate: ['']
//     });
//   }
//
//   ngOnInit() {
//     // Initialize transactions if needed
//     this.fetchWalletTransaction();
//   }
//
//   fetchWalletTransaction() {
//     const filterValues = this.filterForm.value;
//     this.centralServerService.getWalletTransaction(this.userId, filterValues.startDate, filterValues.endDate).subscribe(
//       (data) => {
//         this.transactions = data; // Adjust based on your API response
//         console.log('Transaction history:', this.transactions);
//       },
//       (error) => {
//         console.error('Error fetching wallet transaction history:', error);
//       }
//     );
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from '../../../types/User';
import { CentralServerService } from '../../../services/central-server.service';

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  // styleUrls: ['./wallet-transactions.component.css']
})
export class WalletTransactionsComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() wallet: any;
  @Input() userId!: string;
  transactions: any[] = [];
  filterForm: FormGroup;
  showFilters = false;
  filtersApplied = false;

  constructor(
    private centralServerService: CentralServerService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    }, { validator: this.dateRangeValidator() }); // Apply custom validator
  }

  ngOnInit() {
    // Initialize transactions if needed
    this.fetchWalletTransaction();

    // Subscribe to startDate changes to update endDate min date
    this.filterForm.get('startDate')?.valueChanges.subscribe(startDate => {
      const endDateControl = this.filterForm.get('endDate');
      if (startDate) {
        endDateControl?.setValue(null); // Reset endDate when startDate changes
        endDateControl?.setValidators([Validators.required, this.endDateValidator(startDate)]);
        endDateControl?.updateValueAndValidity();
      }
    });
  }

  // Custom validator function to ensure endDate is after startDate
  private dateRangeValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const startDate = formGroup.get('startDate')?.value;
      const endDate = formGroup.get('endDate')?.value;

      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        return { 'dateRangeInvalid': true };
      }
      return null;
    };
  }

  // Custom validator function for endDate based on startDate
  private endDateValidator(startDate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && new Date(control.value) <= new Date(startDate)) {
        return { 'endDateInvalid': true };
      }
      return null;
    };
  }

  fetchWalletTransaction() {
    const filterValues = this.filterForm.value;
    this.centralServerService.getWalletTransaction(this.userId, filterValues.startDate, filterValues.endDate).subscribe(
      (data) => {
        this.transactions = data.reverse(); // Adjust based on your API response
      },
      (error) => {
        console.error('Error fetching wallet transaction history:', error);
      }
    );
  }

  applyFilters() {
    if (this.filterForm.valid) {
      this.fetchWalletTransaction();
      this.filtersApplied = true; // Mark filters as applied
    }
  }

  resetFilters() {
    this.filterForm.reset();
    this.showFilters = false;
    this.filtersApplied = false;
    this.fetchWalletTransaction(); // Fetch all transactions without filters
  }
}


