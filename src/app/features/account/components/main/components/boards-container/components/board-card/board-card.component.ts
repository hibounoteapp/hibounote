import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Board } from '@custom-interfaces/board';
import { EditBoardModalComponent } from '../../../../../edit-board-modal/edit-board-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { IconService } from '@shared-services/icon/icon.service';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { DeleteConfirmationComponent } from '../../../../../edit-board-modal/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'board-container-card',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule, MatMenuModule],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss'
})
export class BoardCardComponent {
  @Input() item!: Board;
  @Input() filter!: ()=>void;
  @Output() editBoard = new EventEmitter<Event>();

  constructor(
    private dialog: MatDialog,
    private boardData: BoardDataService,
    public iconService: IconService,
    protected renderer: Renderer2,
    protected router: Router
  ) {

  }

  confirmDelete(id: string) {
    const dialog = this.dialog.open(DeleteConfirmationComponent)

    dialog.afterClosed().subscribe((result)=>{
      if(result==="DELETE") {
        this.boardData.deleteBoard(id);
        return
      }
    })
  }

  enterBoard(event: Event) {
    event.preventDefault()
    if(!(event instanceof MouseEvent)) return

    console.log('ENTERING',event)

    this.router.navigate(['/board'],{
      queryParams: {id: this.item.id}
    })

  }

  favBoard(event: Event) {
    console.log('FAV',event)
  }

  // editBoard(event: Event, id: string) {
  //   const dialog = this.dialog.open(EditBoardModalComponent,{
  //     width: '30%',
  //     height: '40%',
  //     data:{id:id}
  //   });

  //   dialog.afterClosed().subscribe((result)=>{
  //     const {id, value} = result
  //     if(value === '') return;

  //     if(result.value === '$#DELETE#$') {
  //       this.boardData.deleteBoard(id);
  //       this.filter();
  //       return
  //     }

  //     this.boardData.editBoardName(id,value)
  //     this.filter();
  //   })


  //   dialog.afterClosed().subscribe(result=>{
  //     console.log(result);
  //   })
  // }
}
