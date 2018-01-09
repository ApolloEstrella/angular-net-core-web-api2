import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.css']
})
export class OkDialogComponent implements OnInit {

  public title: string;
  public message: string;

  constructor(public dialogRef: MatDialogRef<OkDialogComponent>) { }

  ngOnInit() {
  }

}
