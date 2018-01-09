import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DialogsService } from './dialogs.service';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [ConfirmDialogComponent, OkDialogComponent],
  exports: [ConfirmDialogComponent, OkDialogComponent],
  entryComponents: [ConfirmDialogComponent, OkDialogComponent],
  providers: [DialogsService]
})
export class DialogsModule { }