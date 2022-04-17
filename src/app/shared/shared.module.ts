import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, FlexLayoutModule],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    CommonModule,
  ],
})
export class SharedModule {}
