import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import * as XLSX from 'xlsx';
import {ProjectService} from '../../../core/services/project.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-data-collection',
  templateUrl: './data-collection.component.html',
  styleUrls: ['./data-collection.component.scss']
})
export class DataCollectionComponent implements OnInit {
  dataForm!: FormGroup;
  submitted = false;
  isShow = false;
  isFileUpload = false;
  fileName: string;
  file: any;
  fileType='1'
  arrayBuffer: any;
  fileCelDetail = {
    FEM: 'B31:M38',
    HEX: 'B63:M70',
    ROX: 'B95:M102',
    ATTO647: 'B31:M38',
    ATTO555: 'B63:M70',
  };
  cellData!: any;
  graphType =  localStorage.getItem('graphType');

  constructor(private route: Router,
              private projectService: ProjectService
              ,private fb: FormBuilder,private toaster: ToastrService) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      instrument: ['',[Validators.required,Validators.pattern('\\S(.*\\S)?')]],
      femStart: ['B31',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]],
      femEnd: ['M38',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]],
      hexStart: ['B63',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]],
      hexEnd: ['M70',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]],
      roxStart:['B95',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]],
      roxEnd:['M102',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]],
      atto647Start:this.graphType === 'true'?['B31',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]]:[''],
      atto647End:this.graphType === 'true'?['M38',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]]:[''],
      atto555Start:this.graphType === 'true'?['B63',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]]:[''],
      atto555End:this.graphType === 'true'?['M70',[Validators.required,Validators.pattern('[A-Z]{1}' + '[0-9]{0,9}')]]:[''],
      cellOne: [''],
      cellTwo: [''],
    });
    this.cellData = JSON.parse(localStorage.getItem('dataCollection')!);
    console.log('cell',this.cellData);
  }

  proceed(){
    let data;
    if(this.dataForm.invalid){
      this.submitted = true;
      return;
    }else{
      data = {
        instrumentName: this.dataForm.value.instrument,
        cellDetails: {
          femStart: this.dataForm.value.femStart,
          femEnd: this.dataForm.value.femEnd,
          hexStart: this.dataForm.value.hexStart,
          hexEnd: this.dataForm.value.hexEnd,
          roxStart:this.dataForm.value.roxStart,
          roxEnd: this.dataForm.value.roxEnd,
          atto555Start:this.dataForm.value.atto555Start,
          atto555End: this.dataForm.value.atto555End,
          atto647Start: this.dataForm.value.atto647Start,
          atto647End: this.dataForm.value.atto647End
        },
        ntcCellDetails: {
          ntc: this.isShow? true: false,
          cellOne: this.dataForm.value.cellOne,
          cellTwo: this.dataForm.value.cellTwo
        }
      };
      console.log(data);
      if(this.fileName){
        localStorage.setItem('cellDetails',JSON.stringify(data));
        this.route.navigate(['user/project/generate_report']);
      }else{
        this.toaster.error('Add Excel File to proceed');
        return;
      }
    }
  }
  toggleDisplay() {
    this.isShow = !this.isShow;
    }
    BackToNew(){
      this.route.navigate(['user/project/add_project']);

    }
    get f(){
      return this.dataForm.controls;
    }
  submit(event) {
      this.file = event.target.files[0];
      this.fileName = event.target.files.item(0).name;
      this.isFileUpload = true;
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();
        for (let i = 0; i !== data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, {type: 'binary'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.loadFileData(worksheet);
      };
  }
  loadFileData(worksheet) {

    try {
      const cell = {
        FEM: this.dataForm.value.femStart?this.dataForm.value.femStart + ':' + this.dataForm.value.femEnd:this.fileCelDetail.FEM,
        HEX: this.dataForm.value.hexStart?this.dataForm.value.hexStart + ':' + this.dataForm.value.hexEnd:this.fileCelDetail.HEX,
        ROX: this.dataForm.value.roxStart?this.dataForm.value.roxStart + ':' + this.dataForm.value.roxEnd:this.fileCelDetail.ROX,
        ATTO647: this.graphType == 'true' ?  (this.dataForm.value.atto647Start?this.dataForm.value.atto647Start + ':' + this.dataForm.value.atto647End:this.fileCelDetail.ATTO647):'',
        ATTO555: this.graphType == 'true' ? (this.dataForm.value.atto555Start?this.dataForm.value.atto555Start + ':' + this.dataForm.value.atto555End:this.fileCelDetail.ATTO555):'',
      };
      let toCheckNoOfRowsInEachTable 
      let toCheckNoOfColumnsInEachTable
      this.fileCelDetail = cell.FEM.charAt(0) !==':'? cell:this.fileCelDetail;
      console.log('file cell data '+JSON.stringify(this.fileCelDetail));
      if (this.fileCelDetail && Object.values(this.fileCelDetail).length) {
        const fileNames = Object.keys(this.fileCelDetail);
        let excelData :any = [];
        const dataObj = {};
        Object.values(cell).forEach((cellValue, index) => {
          // get range value
          excelData = [];
          if (cellValue) {
            const range = XLSX.utils.decode_range(cellValue);
            const startRow = range.s.r; const endRow = range.e.r; const startCol = range.s.c; const endCol = range.e.c;
            // let noOfEelmentInTable = ((endRow+1 -startRow) * (endCol+1 - startCol));
            // if(this.cellData.plateFormat != (noOfEelmentInTable as unknown) as string){
            //   console.log(`the excle data ${index+1}th table element count ${noOfEelmentInTable} not match with plate Format ${this.cellData.plateFormat}`)
            //   throw(`The inputs Range Does not match with plate formate ${this.cellData?.plateFormat} `)
            // }

            if(!toCheckNoOfColumnsInEachTable && !toCheckNoOfRowsInEachTable){
              toCheckNoOfRowsInEachTable = endRow - startRow;
              toCheckNoOfColumnsInEachTable = endCol - startCol
            }else{
              if(!(toCheckNoOfRowsInEachTable == (endRow - startRow) && toCheckNoOfColumnsInEachTable == (endCol - startCol)) ){
                console.log('no of rows and columns selected does not same for all table ')
                throw('no of rows and columns selected does not same for all table ')
              }            
            }

            let dataVal :any = [];
            for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
              dataVal = [];
              for (let colNum = startCol; colNum <= endCol; colNum++) {
                const secondCell = worksheet[XLSX.utils.encode_cell({r: rowNum, c: colNum})];
                if(typeof(secondCell?.v) == 'number'){
                  dataVal.push(secondCell.v);
                }else{
                  console.log('the excle table not only contains numbers')
                  throw('The inputs Does not match exactly with Excel File')
                }
              
              }
              excelData.push(dataVal);
            }
            dataObj[fileNames[index]] = excelData;
          }
        });
        this.projectService.excelData = dataObj;
      }
    } catch (error) {
      console.log(error)
      this.toaster.error(error);
      this.removeFile()
    }

  }
  removeFile() {
    this.file = '';
    this.fileName = '';
    this.isFileUpload = false;
  }

  //----------------------------------------to add file type--------------------------------------

  addNewFileType(){
    console.log('addNewFileType')
  }

  changeFileType(){
    if(this.fileType === '2'){
      console.log('file type 2 is selected')

      let fileTablestr ={
        femStart:'B46',
        femEnd:'Y61',
        hexStart:'B87',
        hexEnd:'Y102',
        roxStart:'B128',
        roxEnd:'Y143',
        atto555Start:'B87',
        atto555End:'Y102',
        atto647Start:'B46',
        atto647End:'Y61'
      }
      this.dataForm.patchValue(fileTablestr)
      return
    }

    if(this.fileType === '1'){
      let fileTablestr ={
        femStart:'B31',
        femEnd:'M38',
        hexStart:'B63',
        hexEnd:'M70',
        roxStart:'B95',
        roxEnd:'M102',
        atto555Start:'B63',
        atto555End:'M70',
        atto647Start:'B31',
        atto647End:'M38'
      }
      this.dataForm.patchValue(fileTablestr)
      return
    }

    if(this.fileType === 'addNewFileType'){
      this.addNewFileType()
      return
    }

  }

  //--------------------------------------------------------------------------------------------------
}

