import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import * as Chart from 'chart.js';
import { Router } from '@angular/router';
// import * as html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit, AfterViewInit,OnDestroy {
  excelData: any;
  hexData: any;
  roxData: any;
  femData: any;
  atto555Data: any;
  atto647Data: any;
  graphType: any;
  canvas: any;
  ctx: any;
  canvas2: any;
  ctx2: any;
  dataCollection:any = JSON.parse(localStorage.getItem('dataCollection'))
  project_name:string = this.dataCollection?.projectName // for name and title of pdf 
  // @ViewChild('chart') chart!: any;
  // @ViewChild('chart2') chart2!: any;
  
  currentDownloadType = 'PDF' //  file format to download the report
  downloadBtnDisable = false; // to disable on generate the file

  public graph1:any;
  public graph2:any;
  table3:any;
  table4:any;



  // this object have data of the different type of points of the graph
  pointDataTypes :any= {
    data1 : {name:'data 1',color:'red',lightColor:"#e37f7f9c"},
    data2 : {name:'data 2',color:'blue',lightColor:"#9e9effcf"},
    data3 : {name:'data 3',color:'green',lightColor:"#a2f1a2ad"},
    data4 : {name:'data 4',color:'black',lightColor:"#969697"},
    data5 : {name:'data 5',color:'#ffbc00',lightColor:"#e9c45c"}
  }

  //to store the point which is selected by graph or table(draging/selecting)
  selectedPoints :any = [];
  selectedPointsTable1:any =[]
  selectedPointsTable2:any=[]

  // this is for set light or dark color for unselected points in graph
  isPointSelected :boolean = false;

  // this is for handle select event on table
  isMouseDown = false;
  startCell:any

  //this is for highlight the selected cell on table
  selectedCellsData :any= []



  // this are for table template filter
  selectedTableTemplateCode:any=''
  tableTemplateCodeOption:any =[
    { value: 'quad_1A', label: 'Quad_A1' },
    { value: 'quad_1B', label: 'Quad_A2' },
    { value: 'quad_2A', label: 'Quad_B1' },
    { value: 'quad_2B', label: 'Quad_B2' },
  ]
  tabletemplateCode={
    quad_1A:'quad_1A',
    quad_1B:'quad_1B',
    quad_2A:'quad_2A',
    quad_2B:'quad_2B',
  }
  alphabetOrderForNumber = this.getAlphabetOrderForNumber(100)

  @ViewChild('myTable1', { static: false }) myTable1!: ElementRef;
  @ViewChild('myTable2', { static: false }) myTable2!: ElementRef;


  constructor(
    private router: Router,
    private ngxLoader: NgxUiLoaderService
  ) {
    const graph = localStorage.getItem('graphType');
    if (graph === 'true') {
      this.graphType = 'Graph 2x';
    } else {
      this.graphType = 'Graph 1x';
    }
  }

  ngOnInit(): void {
    const projectView = JSON.parse(localStorage.getItem('projectDetails'));
    if (projectView && projectView.isView) {
      this.project_name = projectView?.project_name
      this.excelData = projectView.calculatedData[0]
      // this.excelData = projectView.calculatedData // changed after implement indexed db
      // this.excelData = projectView.uploadedFileData[0] // for testing 

      console.log(this.excelData);
      this.roxData = this.excelData.ROX;
      console.log('graph data collection ');
      this.femData = this.excelData.FEM;
      this.hexData = this.excelData.HEX;
      this.atto555Data = this.excelData?.ATTO555;
      this.atto647Data = this.excelData?.ATTO647;

      // this.femData = this.divideMatrix(this.excelData.FEM, this.roxData); // for testing 
      // this.hexData = this.divideMatrix(this.excelData.HEX, this.roxData); // for testing 
      // this.atto555Data = this.divideMatrix(this.excelData?.ATTO555, this.roxData) // for testing 
      // this.atto647Data = this.divideMatrix(this.excelData?.ATTO647, this.roxData) // for testing 

    } else {
      this.excelData = JSON.parse(localStorage.getItem('excelCollection'));
      this.roxData = this.excelData.ROX;
      console.log('graph data collection ');
      console.log(this.excelData.FEM);
      this.femData = this.divideMatrix(this.excelData.FEM, this.roxData);
      this.hexData = this.divideMatrix(this.excelData.HEX, this.roxData);
      if(this.graphType == 'Graph 2x'){
        this.atto555Data = this.divideMatrix(this.excelData.ATTO555, this.roxData);
        this.atto647Data = this.divideMatrix(this.excelData.ATTO647, this.roxData);
      }
    }

    this.genrateGraphTables()
    this.tableTemplateCodeOption = this.getTableTemplateCodeOption()
    this.genrateGraphs()
    console.log('table3 ', this.table3)
    console.log('table4 ', this.table4)
  }

  ngAfterViewInit() {
    console.log(' ReportViewComponent ngAfterViewInit ')
  }

  ngOnDestroy(): void {
    localStorage.removeItem("excelCollection");
    localStorage.removeItem("projectDetails")
  }

  genrateGraphTables(){
    if(this.graphType == 'Graph 2x' ){
      this.table3 = this.genrateGraphPointsTable(this.hexData,this.femData)
      this.table4 = this.genrateGraphPointsTable(this.atto647Data,this.atto555Data)
    }else{
      this.table3 = this.genrateGraphPointsTable(this.hexData,this.femData)
    }
  }

  genrateGraphs(){
    if(this.graphType == 'Graph 2x' ){
      this.graph1 = this.genrateGraph(this.table3,'HEX','FAM')
      this.graph2 = this.genrateGraph(this.table4,'atto647Data','atto555Data')
    }else{
      this.graph1 = this.genrateGraph(this.table3,'HEX','FAM')
    }
  }

  genrateGraph(table,x_title,y_title){
    let that = this
    let dtick = 0.005//0.045
    // let rangeInitial = 0
    return new function()  {
      this.data= that.getPointsData(table)
      let min_x = Math.min(...this.data.flatMap(obj => obj.x))
      let min_y = Math.min(...this.data.flatMap(obj => obj.y))
      this.layout =  {
        // dragmode: 'lasso', // enable lasso selection
        dragmode: 'pan',
        width: 780,
        height: 512,
        title: `${x_title} VS ${y_title}`,
        xaxis: {
          title: x_title,
          showspikes: false,
          spikemode: 'across',// or 'toaxis' or 'marker' 
          spikecolor:'black',
          spikethickness:1,
          spikedash:'dot',
          // spikesnap:"hovered data"
          // showline:true,
          tickson:'labels',
          min_x,// min_y is nor for ploty (for local)
          tickmode:"auto",
          // nticks:10, // max no of ticks in the axis
          // dtick : dtick,// for interval in axis
          // autorange: false,
          rangemode:'tozero',
          // // ticklen:3,
          // range:[ min_x- dtick, min_x + (dtick * 9)]
          
          ticklen:4,
          // ticklabelstep:2,
          // tickwidth : 5
        },
        //range: [ -1, 5.25 ]
        yaxis: {
          title: y_title,
          showspikes: false,
          spikemode: 'across',// or 'toaxis' or 'marker' 
          spikecolor:'black',
          spikethickness:1,
          spikedash:'dot',
          // spikesnap:"hovered data"
          // showline:true,
          tickson:'labels',
          min_y,// min_y is nor for ploty (for local)
          // tick0  : 0,
          tickmode:"auto",
          // nticks:10, // max no of ticks in the axis
          // dtick : dtick,
          // autorange: false,
          rangemode:'tozero',
          // // ticklen:3,
          // // // nticks:5,
          // range:[ min_y - dtick, min_y + (dtick * 9)]

          ticklen:4,
        },
        modebar : {
          activecolor:'red',
          // add : ["v1hovermode", "hoverclosest", "hovercompare", "togglehover", "togglespikelines", "drawline", "drawopenpath", "drawclosedpath", "drawcircle", "drawrect", "eraseshape"],
          color:'#5353a3d4',
          // orientation:'v',
          itemsizing :'constant',
          itemwidth:37
        },
        legend: {
          // bgcolor:'#faa122',
          // bordercolor:'red',
          // entrywidth:100,
          // visible:false,
          // xanchor:'right'
        },
        // paper_bgcolor:'blue',
        // plot_bgcolor:'black',
      }
      this.config = {
        modeBarButtonsToRemove: ['select2d'],
        displaylogo: false,
        displayModeBar: true,
        scrollZoom: true,
        modeBarButtonsToAdd:[
          "hoverCompareCartesian",
          // "hoverClosestCartesian",
          // "CompareDataOnHover",
          "toggleSpikelines",
          // "toggleHover"
        ] 
      }
    };
    // return {
    //   data: this.getPointsData(table),
    //   layout:  {
    //     dragmode: 'lasso', // enable lasso selection
    //     width: 700,
    //     height: 500,
    //     title: `${x_title} VS ${y_title}`,
    //     xaxis: {
    //       title: x_title,
    //       showspikes: false,
    //       spikemode: 'across',// or 'toaxis' or 'marker' 
    //       spikecolor:'black',
    //       spikethickness:1,
    //       spikedash:'dot',
    //       // spikesnap:"hovered data"
    //       showline:true,
    //       tickson:'boundaries',

    //       // tickmode:"sync",
    //       nticks:10,
    //       dtick : dtick,
    //       // autorange: false,
    //       // rangemode:'nonnegative',
    //       // ticklen:3,
    //       range:[rangeInitial, rangeInitial + (dtick * 10)]
          
    //     },
    //     //range: [ -1, 5.25 ]
    //     yaxis: {
    //       title: y_title,
    //       showspikes: false,
    //       spikemode: 'across',// or 'toaxis' or 'marker' 
    //       spikecolor:'black',
    //       spikethickness:1,
    //       spikedash:'dot',
    //       // spikesnap:"hovered data"
    //       showline:true,
    //       tickson:'boundaries',

    //       // tick0  : 0,
    //       // tickmode:"linear",
    //       // dtick : dtick,
    //       // ticklen:3,
    //       // // nticks:5,
    //       // range:[rangeInitial, rangeInitial + (dtick * 8)]
    //     },
    //   },
    //   config : {
    //     modeBarButtonsToRemove: ['select2d'],
    //     displaylogo: false,
    //     modeBarButtonsToAdd:[
    //       "hoverCompareCartesian",
    //       // "hoverClosestCartesian",
    //       // "CompareDataOnHover",
    //       "toggleSpikelines",
    //       // "toggleHover"
    //     ] 
    //   }
    // };
  }

  divideMatrix(array1: any[], array2: any[]) {
    const row1 = array1?.length;
    let result:any =[]
    if(row1){
      const col1 = array1[0]?.length //this.size(array1[0]);
      for (let i = 0; i < row1; i++) {
        result[i] = []
        for (let j = 0; j < col1; j++) {
          const index2 = j//String.fromCharCode(65 + j);
          const num1 = array1[i][index2];
          const num2 = array2[i][index2];
          result[i][index2] = (num1 / num2).toFixed(2);
        }
      }
    }
    return result;
  }


  // size = function (obj) {
  //   let size = 0;
  //   let key;
  //   for (key in obj) {
  //     if (obj.hasOwnProperty(key)) { size++; }
  //   }
  //   return size;
  // };


  backToProjectList() {
    localStorage.removeItem('projectDetails');
    this.router.navigate(['user/project/list']);
  }


  getPointDataTypesByName(dataTypeName:string){
    for (const key in this.pointDataTypes) {
        if(this.pointDataTypes[key].name == dataTypeName ){
          return this.pointDataTypes[key]
      }
    }
  }


  genrateGraphPointsTable(x_coordinate_table:any,y_coordinate_table:any){
    // this is for create a new table of element having data of (x-axis, y-axis, color)
    // the x-axis of an element is created by the value of the respective place of the first parameter (x_coordinate_table)
    // the y-axis of an element is created by the value of the respective place of the second parameter (y_coordinate_table)
    // the color of an element is created by the a calculation from the function getColorOfPoint

    if(x_coordinate_table.length == y_coordinate_table.length  &&
       Object.keys(x_coordinate_table[0]).toString() == Object.keys(y_coordinate_table[0]).toString()){
    }

    let pointsTable:any = []

    const row1 = x_coordinate_table.length;
    const col1 = Object.keys(y_coordinate_table[0]).length;
    console.log('xarray ' , x_coordinate_table)
    console.log('yarray ' , y_coordinate_table)
    
    for (let i = 0; i < row1; i++) {
      // const resultobj:any = {};
      const resultobj:any = [];// {} => []
      for (let j = 0; j < col1; j++) {
        const index2 = j//String.fromCharCode(65 + j);
        const data = {
         value: {
                  x: x_coordinate_table[i][index2],
                  y: y_coordinate_table[i][index2]
                },
         details:{
          color:this.getColorOfPoint(x_coordinate_table[i][index2],y_coordinate_table[i][index2]),
          selected:false,// to handle the highlight the selected points (selection by lasso select or table draging)
          visiblity:true, // to show the point on graph and table WRT table template filter
         }

        };
        // resultobj[index2]=data;
        resultobj.push(data)
      }
      pointsTable.push(resultobj)
      
    }
    // console.log(pointsTable)
    return pointsTable
  }

  getColorOfPoint(x_point:number,y_point:number){
    // this is the calculation part for color (with x,y coordinates)

    if (x_point < y_point) {
      return this.pointDataTypes.data1.color
    } else if (x_point ===2*(y_point)) {
      return this.pointDataTypes.data2.color
    } else {
      return this.pointDataTypes.data3.color
    }
  }

  getCodinates(pointDataType:any,table:any){
    // this is for to create group of x cordinate, y cordinate and color as array of each points for 
    // particular graph data type (group of same color of scatted point )  by color 

    let name = pointDataType.name
    let color= pointDataType.color
    let x :any = []
    let y :any= []
    let colors :any = []
    table.forEach((objElement:any) => {
      // Object.keys(objElement).forEach((objField:any)=>{
        objElement.forEach((obj:any,objField:any)=>{
        // checking the visiblity (point to show or not to show)
        if(objElement[objField].details.visiblity){
          if(objElement[objField].details.color == color){
            x.push(objElement[objField].value.x)
            y.push(objElement[objField].value.y)
            
            if(objElement[objField].details.selected){
              // dark color for selected points
              colors.push(color)
  
            }else if(!this.isPointSelected){
              colors.push(color)
            }else{
              //light color for non selected points
              colors.push(pointDataType?.lightColor) 
            }
          }
        }
      })
    });
    return {
      x,y,colors,name
    }
  }

  updateGraph(table:any){
    // regenerate the graph with updated data
    if(table == this.table3 ){
     this.graph1.data = this.getPointsData(table)
    }else{
     this.graph2.data = this.getPointsData(table)
    }
  }


  changePointsColor(color:string,table:any){
    // this is for change the color of selected points on graph and table 
    // the points can be selected through graph lasso select or table selection (draging)

    this.selectedPoints =  table == this.table3 ? this.selectedPointsTable1 : this.selectedPointsTable2

    this.selectedPoints.forEach((points:any)=>{
      table.forEach((objElement:any) => {
        // Object.keys(objElement).forEach((objField:any)=>{
          objElement.forEach((obj:any,objField:any)=>{
          // to change the color of only the visible points
          if(objElement[objField].details.visiblity){
            if(objElement[objField].details.color == points.details.color){
    
              if(objElement[objField].value && objElement[objField].value?.x == points.value.x &&
                 objElement[objField].value?.y == points.value.y){
                  objElement[objField].details.color = color;
              }
            }
          }
        })
      });
    })    

    this.isPointSelected=false
    this.selectedPoints.length=0
    this.deselectAllpointsInTable(table)
     // regenerate the graph with updated data
     this.updateGraph(table)
  }

  getPointsData(table:any){
    // this is for return the datas for graph from table which have element as x,y,color as object
    // the data is an object of (x,y) cordinate , color for scatted point for particular graph data type 

    let graphData :any = []
    for(let element in this.pointDataTypes){
      let currentGraphDataData =this.getCodinates(this.pointDataTypes[element],table)
      graphData.push(
        { 
          x: currentGraphDataData.x,
          y: currentGraphDataData.y,
          type: 'scatter', 
          mode: 'markers', 
          marker: {color: currentGraphDataData.colors},
          name: currentGraphDataData.name,
        }
      )
    };
    return graphData;
  }



  plotlySelect(event:any,table:any){
    // this is for handle lasso select event of plotly graph

    if(event?.lassoPoints){
      this.isPointSelected =true
      // console.log('with lassopoints') 
      this.selectedPoints = table == this.table3 ? this.selectedPointsTable1 : this.selectedPointsTable2
      this.deselectAllpointsInTable(table)
      this.selectedPoints.length = 0
      console.log('plotlySelect event ' , event)
      event?.points?.forEach((element:any)=>{
          this.selectedPoints.push({
            value:{x:element.x,y:element.y},
            details:{color: this.getPointDataTypesByName(element.data.name).color}
            //consider on adding visibility field in this object
          })
      })
      console.log('selected points ',this.selectedPoints)

      // end of the lasso select event we will going to recreate the graph 
      // with different color points based on the selected points
      this.plotlySelectColorChange(table)
    }

  }

  plotlyDeselect(table:any){
    this.isPointSelected =false
    this.deselectAllpointsInTable(table)
    this.selectedPoints =  table == this.table3  ? this.selectedPointsTable1 : this.selectedPointsTable2
    this.selectedPoints.length =0 //to empty the array which is refered
     // regenerate the graph with updated data
     this.updateGraph(table)
    //make all point selected = false
    console.log('plotlyDeselect ')
  }


  plotlySelectColorChange(table:any){
    //this first will going to change the table's selected field in element of the table to selecte = true 
    // then regenerate the graph with changed data on the tabel 
    //(point of selected element   color will be different )

    this.selectedPoints = table == this.table3 ? this.selectedPointsTable1 : this.selectedPointsTable2
    //change the color for selected points
    this.selectedPoints.forEach((points:any)=>{
      table.forEach((objElement:any) => {
        // Object.keys(objElement).forEach((objField:any)=>{
          objElement.forEach((obj:any,objField:any)=>{
          // console.log(objField)
          // to make selected = true only for visible points
          if(objElement[objField].details.visiblity){
            if(objElement[objField].details.color == points.details.color){
    
              if(objElement[objField].value && objElement[objField].value?.x == points.value.x &&
                 objElement[objField].value?.y == points.value.y){
                  objElement[objField].details.selected = true;
                }
            }
          }
        })
      });
    })    

   // regenerate the graph with updated data
   this.updateGraph(table)
  }

  deselectAllpointsInTable(table:any){
    // this will make selected = false for the table for all element
    table.forEach((objElement:any) => {
      // Object.keys(objElement).forEach((objField:any)=>{
        objElement.forEach((obj:any,objField:any)=>{
        objElement[objField].details.selected = false;
      })
    });
  }

  tableBodyMousedown(event:any){
    this.isMouseDown = true;
    this.startCell = event.target;
    this.startCell.classList.toggle('selecting');
    event.preventDefault(); // Prevents text selection
    console.log('table body tableBodyMousedown')
  }


tableBodyMouseup(event:any,table:any){
  this.isMouseDown = false;
  console.log('table body tableBodyMouseup')
  this.getSelectedData(table)
}

tableBodyMouseLeave(event:any,table:any){
  if (this.isMouseDown) {
    this.isMouseDown = false;
    console.log('table body tableBodyMouseup')
    this.getSelectedData(table)
  }
}



tableBodyMouseOver(event:any,table:any){
  if (this.isMouseDown) {
    this.selectCells(this.startCell, event.target,table);
  }
}


selectCells(start:any, end:any,table:any) {
  this.clearSelection(table);
  this.deselectAllpointsInTable(table)
  this.selectedCellsData = [];
  this.selectedPoints =  table == this.table3 ? this.selectedPointsTable1 : this.selectedPointsTable2
  this.selectedPoints.length =0

  let currentTable = table == this.table3 ? this.myTable1.nativeElement :this.myTable2.nativeElement
  let startRowIndex = start.parentNode.rowIndex;
  let endRowIndex = end.parentNode.rowIndex;
  let startCellIndex = start.cellIndex;
  let endCellIndex = end.cellIndex;

  let minRow = Math.min(startRowIndex, endRowIndex);
  let maxRow = Math.max(startRowIndex, endRowIndex);
  let minCell = Math.min(startCellIndex, endCellIndex);
  let maxCell = Math.max(startCellIndex, endCellIndex);

  for (let i = minRow; i <= maxRow; i++) {
    let rowdom = currentTable.rows[i];
    let row = table[i-1]
    for (let j = minCell; j <= maxCell; j++) {
      if(j  == 0 ){
        continue // to avoid selecting s.no column
      }
      let celldom = rowdom.cells[j];
      let cell = row[j-1]//celldom //row[String.fromCharCode(65 + j-1)];
      this.selectedPoints.push(cell)
      celldom.classList.add('selecting');
      // this.selectedCellsData.push(cell.textContent);
      this.selectedCellsData.push(cell);
    }
  }
}

clearSelection(table:any) {
  let currentTable = table == this.table3 ? this.myTable1.nativeElement : this.myTable2.nativeElement
  let selectedCells = currentTable.getElementsByClassName('selecting');
  while (selectedCells.length) {
    selectedCells[0].classList.remove('selecting');
  }
  this.selectedCellsData = [];
}

getSelectedData(table:any){
  this.isPointSelected =true
  console.log('selectedCellsData ',this.selectedCellsData);
  this.selectedCellsData.forEach((element:any) => {
    element.details.selected = true
  });
  // console.log(this.table3)
  this.clearSelection(table)
   // regenerate the graph with updated data
   this.updateGraph(table)
}



//---table visiblity of elements with tamplate filter----


visibleAllElementsOfTable(table:any){
  //this is for make visible all the element in the table
  table.forEach((objElement:any) => {
    // Object.keys(objElement).forEach((objField:any)=>{
      objElement.forEach((obj:any,objField:any)=>{
      objElement[objField].details.visiblity = true;
    })
  });
  this.updateGraph(table)
}

visibleSingleRowOfElementsInTable(table:any,nthRowIndex:number){
   //this is for make visible only  the element in nth row of table and others invisible
  table.forEach((objElement:any,rowIndex : number) => {
    // Object.keys(objElement).forEach((objField:any)=>{
      objElement.forEach((obj:any,objField:any)=>{
      if(rowIndex == nthRowIndex){
        objElement[objField].details.visiblity = true;
      }else{
        objElement[objField].details.visiblity = false;
      }
    })
  });
  this.updateGraph(table)
  console.log(`visible true for only ${nthRowIndex} index row of `,table)
}

visible_nth_quadElementsInTable(table:any,startRow:number ,startColumn:number){
   //this is for make visible  the element in row & column of table with an interval(1 of 2) and others invisible
   table.forEach((objElement:any,rowIndex : number) => {
    // Object.keys(objElement).sort().forEach((objField:any,columnIndex)=>{
      objElement.forEach((obj:any,objField:any)=>{
      if(((rowIndex + startRow) % 2 == 1 ) && ((objField + startColumn) % 2 == 1 ) ){
        objElement[objField].details.visiblity = true;
      }else{
        objElement[objField].details.visiblity = false;
      }
    })
  });
  this.updateGraph(table)
  // console.log(`visible true for only ${nthRowIndex} index row of `,table)
}

getTableTemplateCodeOption(plateFormat?:number){
  // let TemplateCodeOption :any =[]
  // if(plateFormat == 96){
  // }else if(plateFormat == 384){
  // }
  let noOfRows = this.table3.length
  for(let i =0 ; i < noOfRows ; i++){
    this.tableTemplateCodeOption.push({ value: 'row_'+i, label: 'Row_' + this.alphabetOrderForNumber[i] })
  }
  return this.tableTemplateCodeOption
}

tableTemplateFilter(table:any){
  console.log('in tableTemplateFilter fun() , selectedTableTemplateCode ',this.selectedTableTemplateCode)
  if(!this.selectedTableTemplateCode){
  return this.visibleAllElementsOfTable(table)
  }

  if(this.selectedTableTemplateCode.includes('row')){
    let nthRow = this.selectedTableTemplateCode.split('_')[1]
    this.visibleSingleRowOfElementsInTable(table,nthRow)
    return
  }

  if(this.selectedTableTemplateCode == this.tabletemplateCode.quad_1A){
    this.visible_nth_quadElementsInTable(table,1,1)
    return
  }

  if(this.selectedTableTemplateCode == this.tabletemplateCode.quad_2A){
    this.visible_nth_quadElementsInTable(table,0,1)
    return
  }

  if(this.selectedTableTemplateCode == this.tabletemplateCode.quad_1B){
    this.visible_nth_quadElementsInTable(table,1,0)
    return
  }

  if(this.selectedTableTemplateCode == this.tabletemplateCode.quad_2B){
    this.visible_nth_quadElementsInTable(table,0,0)
    return
  }
  
}

downloadAsPdf() {
  // download report graph and table as pdf
  this.downloadBtnDisable = true;
  this.ngxLoader.start()

  const elements = ['graph1', 'table1']; // Array of element IDs
  if(this.graphType == 'Graph 2x' ) elements.push('graph2','table2') 
  const pdfWidth = 210; // A4 width in millimeters
  const pdfHeight = 297; // A4 height in millimeters
  const pdf = new jsPDF('p', 'mm', 'a4');

  const title = this.project_name || 'Graph';
  const titleFontSize = 18;
  const textWidth = pdf.getStringUnitWidth(title)
  const textX = (pdfWidth - textWidth) / 2; // to write in centre
  const textY = 10
  pdf.setFontSize(titleFontSize);
  pdf.text(title, textX, textY, { align: 'center' });

  let X_position = 5;
  let Y_position = 20;
  let lastImgHeight = 20

  const processElement = (index) => {

    // funtion recrusion condition
    if (index >= elements.length) { 
      pdf.save(`${this.project_name || ''}Graph.pdf`);
      this.downloadBtnDisable = false;
      this.ngxLoader.stop()
      return;
    }

    const element = document.getElementById(elements[index]) as HTMLElement;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 10 ;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // this condition for add new page if page is not enough to add image 
      // and image height is more than a4 size
      if(imgHeight > pdfHeight || Y_position + imgHeight < pdfHeight ){
        pdf.addImage(imgData, 'PNG', X_position, Y_position, imgWidth, imgHeight);
        lastImgHeight += imgHeight
        Y_position = lastImgHeight
      }else{
        Y_position = 0
        lastImgHeight = 0
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', X_position, Y_position, imgWidth, imgHeight);
        lastImgHeight = Y_position = imgHeight
      }
      processElement(index + 1);//funtion recrusion
    });
  };

  processElement(0)
}

getAlphabetOrderForNumber(numberUpto){
  // num parameter is depent on no.of rows present in table array
  let alphabetSeries :any = []
  for(let i=0 ; i < numberUpto ;i++ ){      
    alphabetSeries.push( String.fromCharCode(65 + (i % 26)) + (Math.floor(i / 26) || '') )
  }
  console.log(alphabetSeries)
  return alphabetSeries
}

plotlyClick(event,table){
  if(event?.points){
    this.isPointSelected =true
    this.selectedPoints = table == this.table3 ? this.selectedPointsTable1 : this.selectedPointsTable2
    this.deselectAllpointsInTable(table)
    // this.selectedPoints.length = 0
    console.log('plotlySelect event ' , event)
    event?.points?.forEach((element:any)=>{
        this.selectedPoints.push({
          value:{x:element.x,y:element.y},
          details:{color: this.getPointDataTypesByName(element.data.name).color}
          //consider on adding visibility field in this object
        })
    })
    console.log('selected points ',this.selectedPoints)

    // end of the lasso select event we will going to recreate the graph 
    // with different color points based on the selected points
    this.plotlySelectColorChange(table)
  }
}

downloadAsCSV() {
  let fileName = `${this.project_name || ''}Table.csv`
  let csvContent =`\n${this.project_name || 'Tables'}\n\n\n HEX vs FAM \n\n`

  csvContent += this.getTableAsStringForCSV(this.hexData)


  if(this.graphType == 'Graph 2x' ){
    csvContent += '\n\n\nATTO647 vs ATTO555\n\n'
    csvContent += this.getTableAsStringForCSV(this.atto647Data)
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) { // HTML5 Blob URL
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
}

getTableAsStringForCSV(table:any){
  let noOfRows = table.length;
  let noOfColumns = table[0]?.length;
  let forCsvContent = "S.no";

  for(let i =0 ; i < noOfColumns ;i++){
    forCsvContent += `,${i+1}`
  }
  forCsvContent += "\n";
  for(let i =0 ; i < noOfRows ;i++){
    forCsvContent += `${this.alphabetOrderForNumber[i]},`
    let row = table[i].join(",");
    forCsvContent += row + "\n";
  }
  return forCsvContent
}

downloadReports(){
  // to download report in selected format

  if(this.currentDownloadType == 'PDF'){
    this.downloadAsPdf()
  }
  if(this.currentDownloadType == 'CSV'){
    this.ngxLoader.start()
    this.downloadBtnDisable = true;
    this.downloadAsCSV()
    this.downloadBtnDisable = false;
    this.ngxLoader.stop()
  }
}
 
plotlyRelayout(event,graph){
  console.log(graph)
  console.log(event)
  if(event[ "xaxis.autorange" ]){
    graph.layout.autorange = true
    graph.layout.xaxis.tickmode = "auto"
    graph.layout.yaxis.tickmode = "auto"
    
  }
}

changeXaxisInterval(graph,interval){
  interval = Number(interval)
  console.log(this.graph1.layout.xaxis)
  if(graph == this.graph1 ){
    this.graph1.layout.autorange  = false;
    this.graph1.layout.xaxis.tickmode = interval ? "linear" : 'auto'
    this.graph1.layout.xaxis.autorange = !Boolean(interval);
    this.graph1.layout.xaxis.dtick = interval
    this.graph1.layout.xaxis.nticks = 10
    this.graph1.layout.xaxis.range = [ this.graph1.layout.xaxis.min_x - interval, this.graph1.layout.xaxis.min_x + (interval * 9)]
    this.graph1.layout = JSON.parse(JSON.stringify(this.graph1.layout))
  }else{
    this.graph2.layout.autorange  = false;
    this.graph2.layout.xaxis.tickmode = interval ? "linear" : 'auto'
    this.graph2.layout.xaxis.autorange = !Boolean(interval);
    this.graph2.layout.xaxis.dtick = interval
    this.graph2.layout.xaxis.nticks = 10
    this.graph2.layout.xaxis.range = [ this.graph2.layout.xaxis.min_x - interval, this.graph2.layout.xaxis.min_x + (interval * 9)]
    this.graph2.layout = JSON.parse(JSON.stringify(this.graph2.layout))
  }
}

changeYaxisInterval(graph,interval){
  interval = Number(interval)
  console.log(this.graph1.layout.yaxis)
  if(graph == this.graph1 ){
    this.graph1.layout.autorange  = false;
    this.graph1.layout.yaxis.tickmode = interval ? "linear" : "auto"
    this.graph1.layout.yaxis.autorange = !Boolean(interval);
    this.graph1.layout.yaxis.dtick = interval
    this.graph1.layout.yaxis.nticks = 10
    this.graph1.layout.yaxis.range = [ this.graph1.layout.yaxis.min_y - interval, this.graph1.layout.yaxis.min_y + (interval * 9)]
    this.graph1.layout = JSON.parse(JSON.stringify(this.graph1.layout))
  }else{
    this.graph2.layout.autorange  = false;
    this.graph2.layout.yaxis.tickmode = interval ? "linear" : "auto"
    this.graph2.layout.yaxis.autorange = !Boolean(interval);
    this.graph2.layout.yaxis.dtick = interval
    this.graph2.layout.yaxis.nticks = 10
    this.graph2.layout.yaxis.range = [ this.graph2.layout.yaxis.min_y - interval, this.graph2.layout.yaxis.min_y + (interval * 9)]
    this.graph2.layout = JSON.parse(JSON.stringify(this.graph2.layout))
  }
}

}
