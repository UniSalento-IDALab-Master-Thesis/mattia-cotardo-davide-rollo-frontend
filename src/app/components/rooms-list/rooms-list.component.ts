import { Component } from '@angular/core';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent {

  branchName: string | null = sessionStorage.getItem('branchName')
  idBranch: any = sessionStorage.getItem('idBranch')

  rooms: Room[] | null = [];

  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private roomService:RoomService, private logService:LogService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.rooms = await this.roomService.getRoomsByIdBranchFromTo(this.idBranch, 1, this.itemsPerPage + 1);

    if(this.rooms){
      if(this.rooms.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.rooms.pop();
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewRoomPage(): void {
    this.router.navigate(['/home/rooms/new']);
  }

  // Delete room by id
  async deleteRoom(room: Room) {

    if (window.confirm('Are you sure you want to delete the room ' + room.name + '?')) {

      this.statusCode = await this.roomService.deleteRoom(room.id);

      if (this.statusCode == 0){
        this.reloadPage()
        window.alert("Room deleted!");
        this.logService.addLog("Deleted room "+room.name)
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }
  

  // Edit room by id
  async editRoom(id: any) {
    sessionStorage.setItem('idRoom', id)
    this.router.navigate(['/home/rooms/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.rooms = await this.roomService.getRoomsByIdBranchFromTo(this.idBranch, startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.rooms = await this.roomService.getRoomsByIdBranchFromTo(this.idBranch, startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.rooms){
        if(this.rooms?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.rooms.pop();
        }
      }
    }
  }

  // Funzioni per esportare gli elementi di dataArray in formato CSV
  
  convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }

  downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  }

  async exportToCSV(){
    if(this.rooms){
      const csvData = this.convertToCSV(this.rooms);
      this.downloadCSV(csvData, "Rooms_List_Of_Branch_"+this.branchName);
      this.logService.addLog("Rooms list of branch "+this.branchName+" exported in CSV")
    }
  }



}
