import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../../core/services/project.service';
import {Router} from '@angular/router';
import { IndexedDbApiService } from '../../../indexedDb/db.api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {
  username: string | undefined = 'John';
  email: string | undefined ='john@gmail.com';
  editField: string;
  graphType =  localStorage.getItem('graphType');
  excelData: any;
  personList: any;
  awaitingPersonList:  any;
  column: any;
  allFileData = {};
  calculatedData: any;
  project_name: any;
  constructor(private projectService: ProjectService,
    private route: Router,
    private indexedDbApiService:IndexedDbApiService,
    private toaster: ToastrService,
    ) {
  }

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('dataCollection'));
    this.project_name = data.projectName
    this.formatFileData();
  }

  formatFileData() {
    this.excelData = this.projectService.excelData;
    console.log('this.excelData', this.excelData);
    localStorage.setItem('excelCollection',JSON.stringify(this.excelData));
    this.excelData= JSON.parse(localStorage.getItem('excelCollection'));
    // Object.keys(this.excelData).forEach(fileName => {
    //   this.allFileData[fileName] = this.excelData[fileName].map(arr => arr.reduce((acc, cur, index) => ({
    //       ...acc,
    //       [String.fromCharCode(65 + index)]: cur
    //     }), Object.create({})));
    // });
    // console.log('this.allFileData', this.allFileData);
    this.allFileData = {...this.excelData}
    this.loadFileData('FEM');
  }

  loadFileData(fileType) {
    this.personList = this.excelData[fileType];
    this.column = Object.keys(this.personList[0]);
    const newFirstElement = 'slNo.';
    this.column = [newFirstElement].concat(this.column);
  }

  updateList(id: number, property: any, event: any) {
    const editField = event.target.textContent;
    this.personList[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingPersonList.push(this.personList[id]);
    this.personList.splice(id, 1);
  }

  add() {
    if (this.awaitingPersonList.length > 0) {
      const person = this.awaitingPersonList[0];
      this.personList.push(person);
      this.awaitingPersonList.splice(0, 1);
    }
  }

  changeValue(id: number, property: any, event: any) {
    this.editField = event.target.textContent;
  }

  generateReport(){
    localStorage.setItem('excelCollection',JSON.stringify(this.allFileData));
    const data = JSON.parse(localStorage.getItem('dataCollection'));
    const cellDetail = JSON.parse(localStorage.getItem('cellDetails'));
    console.log(data);
    this.calculation();
    console.log('calculated data ');
    console.log(this.allFileData);
    console.log(this.calculatedData);
    const projectData = {
      project_name:data.projectName,
      graph_type: data.graphType,
      plate_format:data.plateFormat,
      uploadedFileData: this.allFileData,
      calculatedData: this.calculatedData,
      instrument_name: cellDetail.instrumentName,
      ntc_calculation: cellDetail.ntcCellDetails.ntc,
    };
    const userDetail ={
      userId: JSON.parse(localStorage.getItem('userDetails'))?._id
    }
    
    console.log(projectData);
    // this.projectService.addProject(projectData).subscribe((response: any )=>{
    //   if(response.statusCode === 200){
    //     console.log(response);
    //   }
    // });

    // checking licence validity with indexed db 
    this.indexedDbApiService.checkLicenceValidity().then((LicenceValidity)=>{
      if(LicenceValidity?.isLicenceValid){
        this.indexedDbApiService.addProject({...userDetail,...projectData}).then((res)=>{
          console.log(res)
          this.route.navigate(['user/project/report_view']);
          
        }).catch((error)=>{
          this.toaster.error(error)
        })
      }else{
        this.toaster.error(LicenceValidity?.message);
        this.route.navigate(['home'])
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userDetails');
      }
    }).catch(error => console.log(error))
  }
  calculation() {
    const fileData = JSON.parse(localStorage.getItem('excelCollection'));
    console.log(fileData);
    const femData = this.divideMatrix(fileData.FEM,fileData.ROX);
    const hexData = this.divideMatrix(fileData.HEX,fileData.ROX);
    let atto647Data:any = ''
    let atto555Data:any= ''
    if(this.graphType == 'true'){
       atto555Data = this.divideMatrix(fileData.ATTO555,fileData.ROX);
       atto647Data = this.divideMatrix(fileData.ATTO647,fileData.ROX);
    }
    this.calculatedData = [{
      FEM: femData,
      HEX: hexData,
      ATTO555: atto555Data,
      ATTO647: atto647Data,
    }];
  }


  divideMatrix(array1: any[], array2: any[]){
    const row1 =  array1.length;
    let result 
    if(row1){
      const col1 =  this.size(array1[0]);
      result = array1;
      for (let i = 0; i < row1; i++) {
        for (let j = 0; j < col1; j++) {
          const index2 = j//String.fromCharCode( 65+ j);
          const num1 = array1[i][index2];
          const num2 = array2[i][index2];
          result[i][index2] = (num1/num2).toFixed(2);
        }
      }
    }
    return result;
  }


  size = function(obj) {
    let size = 0;
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {size++;}
    }
    return size;
  };
  BackToNew(){
    this.route.navigate(['user/project/data_collection']);
  }

  trackById(index: number, item: any): any {
    console.log('trackById index',index)
    return item; // Use a unique identifier property instead of 'id' if available
  }


  alphabetOrderForNumber = ((num)=>{
    // num parameter is depent on no.of rows present in table array
    let alphabetSeries :any = []
    for(let i=0 ; i < num ;i++ ){      
      alphabetSeries.push( String.fromCharCode(65 + (i % 26)) + (Math.floor(i / 26) || '') )
    }
    console.log(alphabetSeries)
    return alphabetSeries
  })(100)

}
