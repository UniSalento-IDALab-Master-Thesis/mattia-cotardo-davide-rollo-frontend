import { Component } from '@angular/core';
import { Headphones } from '../../models/headphones';
import { HeadphonesService } from '../../services/headphones.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-new-headphones',
  templateUrl: './new-headphones.component.html',
  styleUrl: './new-headphones.component.scss'
})
export class NewHeadphonesComponent {

  headphones:Headphones = {} as Headphones;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private headphonesService:HeadphonesService, private logService:LogService, private router: Router) {
  }

  // on init
  ngOnInit(){
    this.btnDisabled = false;
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    let existingHeadphones:Headphones | null = {} as Headphones | null;

    // ottenimento della cuffia con il seriale inserito
    existingHeadphones = await this.headphonesService.getHeadphonesBySerial(this.headphones.serial)

    // se la cuffi esiste già
    if(existingHeadphones?.id != null){
      window.alert("An headphones with this serial already exists!");
    }else{
      // aggiunta della cuffia
      this.statusCode = await this.headphonesService.addHeadphones(this.headphones);

      if (this.statusCode == 0){
        window.alert("New headphones added!");

        // aggiunta del log
        this.logService.addLog("Added headphones with serial: "+this.headphones.serial)

        // routing verso la pagina di visualizzazione delle cuffie
        this.router.navigate(['/home/headphones'])
      }
    }

    this.btnDisabled = false;
  }

}
