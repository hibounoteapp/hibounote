import { AfterViewInit, Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { SimpleButtonComponent } from '@shared-components/simple-button';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'account-edit-board-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    SimpleButtonComponent,
    MatIconModule,
    DeleteConfirmationComponent
  ],
  templateUrl: './edit-board-modal.component.html',
  styleUrl: './edit-board-modal.component.scss'
})
export class EditBoardModalComponent implements AfterViewInit{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    public dialog: MatDialog,
    private renderer: Renderer2,
    public boardData: BoardDataService,
    private selfDialog: MatDialogRef<EditBoardModalComponent>
  ) {}

  @ViewChild('inputName',{static:true}) inputName!: ElementRef<HTMLInputElement>;
  newValue: string = '';

  setNewName(event: Event) {
    if(event.target instanceof HTMLInputElement) {
      this.newValue = event.target.value;
    }
  }

  confirmDelete() {
    const dialog = this.dialog.open(DeleteConfirmationComponent, {
      backdropClass: 'bg-visible',
    })

    dialog.afterClosed().subscribe((result)=>{
      if(result==="DELETE") {
        this.selfDialog.close({
          id: this.data.id,
          value: "$#DELETE#$" //? Since value can get the input text, the value to activate delete needs to be something different
        })
      }
    })
  }

  ngAfterViewInit(): void {
    const abstractInput:HTMLInputElement = this.renderer.selectRootElement(this.inputName.nativeElement,true);
    let selectedBoard = this.boardData.getData(this.data.id);
    if(selectedBoard)
    this.renderer.setAttribute(abstractInput,"value",selectedBoard.name);

  }
}
