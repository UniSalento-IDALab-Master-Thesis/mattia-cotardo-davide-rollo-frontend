import { Component } from '@angular/core';
import { Machinery } from '../../models/machinery';
import { Branch } from '../../models/branch';
import { MachineryService } from '../../services/machinery.service';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { Room } from '../../models/room';
import { RoomService } from '../../services/room.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-new-machinery',
  templateUrl: './new-machinery.component.html',
  styleUrl: './new-machinery.component.scss'
})
export class NewMachineryComponent {

  machinery:Machinery = {} as Machinery;

  branches: Branch[] | null = [];
  rooms: Room[] | null = [];

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private machineryService:MachineryService, private branchService:BranchService, private roomService:RoomService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit(){
    this.btnDisabled = false;
    this.branches = await this.branchService.getAll();
    this.rooms = []
  }

  // funzione che si esegue quando si seleziona un branch dal menu a tendina
  async onBranchChange(event: Event) {
    let selectedIdBranch = (event.target as HTMLSelectElement).value;

    // ottenimento delle room di un determinato branch
    this.rooms = await this.roomService.getRoomsByIdBranch(selectedIdBranch);
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    let existingMachinery:Machinery | null = {} as Machinery | null;

    // ottenimento del macchinario con il seriale inserito
    existingMachinery = await this.machineryService.getMachineryByMserial(this.machinery.mserial)

    // se il macchinario esiste già
    if(existingMachinery != null){
      window.alert("A machinery with this mserial already exists!");
    }else{

      // creazione automatica del topic associato al macchinario
      this.machinery.topic = "/"+this.machinery.mserial

      // aggiunta del macchinario
      this.statusCode = await this.machineryService.addMachinery(this.machinery)

      if (this.statusCode == 0){
        window.alert("New machinery added!")

        // aggiunta del log
        this.logService.addLog("Added machinery \""+this.machinery.name+"\" with mserial: "+this.machinery.mserial)

        // routing verso la pagina di visualizzazione macchinari
        this.router.navigate(['/home/machineries'])
      }

    }
    this.btnDisabled = false;
  }

}
