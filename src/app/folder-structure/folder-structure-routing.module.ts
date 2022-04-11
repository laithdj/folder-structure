import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FolderStructureComponent } from './folder-structure.component';

const routes: Routes = [
  { path: '', component: FolderStructureComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FolderStructureRoutingModule { }
