import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderStructureRoutingModule } from './folder-structure-routing.module';
import { FolderStructureComponent } from './folder-structure.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    FolderStructureComponent
  ],
  imports: [
    CommonModule,
    FolderStructureRoutingModule,
    MatTreeModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
  ]
})
export class FolderStructureModule { }




