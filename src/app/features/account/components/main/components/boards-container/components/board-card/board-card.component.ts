import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Board } from '@custom-interfaces/board';
import { EditBoardModalComponent } from '../../../../../edit-board-modal/edit-board-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Component({
  selector: 'board-container-card',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss'
})
export class BoardCardComponent {
  @Input() item!: Board;
  @Input() filter!: ()=>void;

  constructor(
    private dialog: MatDialog,
    private boardData: BoardDataService
  ) {}

  editBoard(event: Event, id: string) {
    const dialog = this.dialog.open(EditBoardModalComponent,{
      width: '30%',
      height: '40%',
      data:{id:id}
    });

    dialog.afterClosed().subscribe((result)=>{
      const {id, value} = result
      if(value === '') return;

      if(result.value === '$#DELETE#$') {
        this.boardData.deleteBoard(id);
        this.filter();
        return
      }

      this.boardData.editBoardName(id,value)
      this.filter();
    })


    dialog.afterClosed().subscribe(result=>{
      console.log(result);
    })
  }
}
