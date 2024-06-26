import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Machinery } from '../models/machinery';
import axios from 'axios';
import { NearbyHeadphones } from '../models/nearby-headphones';
import { SensorService } from './sensor.service';

@Injectable({
  providedIn: 'root'
})
export class MachineryService {

  statusCode: number = 0;

  constructor(private http:HttpClient, private sensorService:SensorService) { }

  // Get all machineries
  async getAll()  : Promise<Machinery[]|null> {
    const apiUrl = 'http://localhost:8080/machinery/getAll'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineries: Machinery[] = response.data;
      return machineries;

    } catch (error) {
      return null;
    }
  }

  // Get machineries from-to filtered
  async getMachineriesFromTo(from: number, to: number, searchedMserial: string, searchedName: string, searchedIdBranch: string, searchedIdRoom: string)  : Promise<Machinery[]|null> {
    
    if(searchedIdBranch == "all branches"){
      searchedIdBranch = ""
    }

    if(searchedIdRoom == "all rooms"){
      searchedIdRoom = ""
    }

    const apiUrl = 'http://localhost:8080/machinery/getMachineriesFromTo?from='+from+'&to='+to+'&mserial='+searchedMserial+'&name='+searchedName+'&idBranch='+searchedIdBranch+'&idRoom='+searchedIdRoom

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineries: Machinery[] = response.data;
      return machineries;

    } catch (error) {
      return null;
    }
  }

  // Get machineries filtered
  async getMachineriesFiltered(searchedMserial: string, searchedName: string, searchedIdBranch: string, searchedIdRoom: string)  : Promise<Machinery[]|null> {
    
    if(searchedIdBranch == "all branches"){
      searchedIdBranch = ""
    }

    if(searchedIdRoom == "all rooms"){
      searchedIdRoom = ""
    }
    
    const apiUrl = 'http://localhost:8080/machinery/getMachineriesFiltered?mserial='+searchedMserial+'&name='+searchedName+'&idBranch='+searchedIdBranch+'&idRoom='+searchedIdRoom

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineries: Machinery[] = response.data;
      return machineries;

    } catch (error) {
      return null;
    }
  }

  // Get machineries by idRoom
  async getMachineryByIdRoom(idRoom: string)  : Promise<Machinery[]|null> {
    const apiUrl = 'http://localhost:8080/machinery/find?idRoom='+idRoom

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineries: Machinery[] = response.data;
      return machineries;

    } catch (error) {
      return null;
    }
  }

  // Get machineries by idBranch
  async getMachineryByIdBranch(idBranch: string)  : Promise<Machinery[]|null> {
    const apiUrl = 'http://localhost:8080/machinery/find?idBranch='+idBranch

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machineries: Machinery[] = response.data;
      return machineries;

    } catch (error) {
      return null;
    }
  }

  // Get machinery by mserial
  async getMachineryByMserial(mserial: string)  : Promise<Machinery|null> {
    const apiUrl = 'http://localhost:8080/machinery/find/machinery/'+mserial

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const machinery: Machinery = response.data;
      return machinery;

    } catch (error) {
      return null;
    }
  }

  // Delete machinery by mserial
  async deleteMachinery(mserial: any) : Promise<number> {
    const apiUrl = 'http://localhost:8080/machinery/delete/'+mserial

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.delete(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      // Verifica se la richiesta è andata bene
      if (response.status === 200) {

        // Aggiornamento dello stato di associazione delle cuffie da True a False
        /*this.statusCode = await this.sensorService.updateMserial(mserial, "");
        
        if (this.statusCode == 0){
          return 0; // Restituisce 0 se la richiesta è andata bene
        }else {
          return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
        }*/
        return 0;
       
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Add a new machinery
  async addMachinery(machinery:Machinery): Promise<number> {
    try {
      const data = {mserial: machinery.mserial, name: machinery.name, topic: machinery.topic, idRoom: machinery.idRoom, idBranch: machinery.idBranch};
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.post('http://localhost:8080/machinery/add', data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Update machinery
  async editMachinery(machinery: Machinery) : Promise<number> {

    const apiUrl = 'http://localhost:8080/machinery/updateMachinery'

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const data = {id: machinery.id, mserial: machinery.mserial, name: machinery.name, idBranch: machinery.idBranch, idRoom: machinery.idRoom, topic: machinery.topic};
      const response = await axios.put(apiUrl, data, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Update machineries by idBranch
  async updateMachineriesByIdBranch(oldIdBranch: any, newIdBranch: any, newIdRoom: any) : Promise<number> {

    const apiUrl = 'http://localhost:8080/machinery/updateMachineriesByIdBranch?oldIdBranch='+oldIdBranch+'&newIdBranch='+newIdBranch+'&newIdRoom='+newIdRoom

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.put(apiUrl, {}, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Update machineries by idRoom
  async updateMachineriesByIdRoom(oldIdRoom: string, newIdRoom: string) : Promise<number> {

    const apiUrl = 'http://localhost:8080/machinery/updateMachineriesByIdRoom?oldIdRoom='+oldIdRoom+'&newIdRoom='+newIdRoom

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.put(apiUrl, {}, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });

      // Verifica se la richiesta è andata bene
      if (response.status === 200) {
        return 0; // Restituisce 0 se la richiesta è andata bene
      } else {
        return 1; // Restituisce 1 se la richiesta ha avuto esito negativo
      }
    } catch (error) {
      return 1; // Restituisce 1 se si è verificato un errore durante la richiesta
    }
  }

  // Get machineries by alarm is solved
  async getMachineriesByAlarmIsSolved(solved: string) : Promise<Machinery[]|null> {
    
    const apiUrl = 'http://localhost:8080/machinery/find/machinery/alarm?solved='+solved

    try {
      var token = JSON.parse(sessionStorage.getItem('token')!)
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer `+token.jwt,
        },
      });
      const dataArray: Machinery[] = response.data;
      
      return dataArray;

    } catch (error) {
      return null;
    }
  }


}
