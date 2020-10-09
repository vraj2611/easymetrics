import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatChipsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  exports: [
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatChipsModule]
})
export class MaterialDesignModule { }
