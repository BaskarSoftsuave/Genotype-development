import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, AfterViewInit{
  addProjectForm!: FormGroup;
  isSubmitted = false;
  graphType!: any;
  hex!: any;
  hex2!: any;
  fam!: any;
  fam2!: any;
  atto!: any;
  atto2!: any;
  rox!: any;
  rox2!: any;
  att!: any;
  att2!: any;
  constructor(private route: Router,private fb: FormBuilder) { }

  ngOnInit(): void {
    // @ts-ignore
    this.addProjectForm = this.fb.group({
      projectName: ['',[Validators.required]],
      graphType: ['', [Validators.required]],
      hexStart:[''],
      hexEnd: [''],
      roxStart:[''],
      roxEnd: [''],
      famStart: [''],
      famEnd: [''],
      attoStart:[''],
      attoEnd:[''],
      atoStart:[''],
      atoEnd:[''],
      plateFormat:['',[Validators.required]]
    });
    console.log(this.addProjectForm.value);
  }
  ngAfterViewInit() {
  }

  selectChange() {

    this.graphType = this.addProjectForm.value.graphType;


    if (this.graphType === 'graph_2') {
      this.graphType = true;
    } else {
      this.graphType = false;
    }
    console.log(this.graphType);
  }

  change(){
    this.hex = this.addProjectForm.value.hexStart;
    this.hex2 = this.addProjectForm.value.hexEnd;
    this.fam = this.addProjectForm.value.famStart;
    this.fam2 = this.addProjectForm.value.famEnd;
    this.rox = this.addProjectForm.value.roxStart;
    this.rox2 = this.addProjectForm.value.roxEnd;
    this.atto = this.addProjectForm.value.attoStart;
    this.atto2 = this.addProjectForm.value.attoEnd;
    this.att = this.addProjectForm.value.atoStart;
    this.att2 = this.addProjectForm.value.atoEnd;
  }


  BackToList(){
    this.route.navigate(['user/project/list']);

  }

  get f() { return this.addProjectForm.controls; }
  save(){
    const collectionData = {
      projectName: this.addProjectForm.value.projectName,
      graphType: this.addProjectForm.value.graphType,
      plateFormat: this.addProjectForm.value.plateFormat,
      alleies: {
        hexStart: this.addProjectForm.value.hexStart,
        hexEnd: this.addProjectForm.value.hexEnd,
        roxStart: this.addProjectForm.value.roxStart,
        roxEnd: this.addProjectForm.value.roxEnd,
        famStart: this.addProjectForm.value.famStart,
        famEnd: this.addProjectForm.value.famEnd,
        attoStart: this.addProjectForm.value.attoStart,
        attoEnd: this.addProjectForm.value.attoEnd,
        atoStart: this.addProjectForm.value.atoStart,
        atoEnd: this.addProjectForm.value.atoEnd,
      }
    };
    if(this.addProjectForm.invalid){
      this.isSubmitted = true;
    }else{
      localStorage.setItem('graphType',this.graphType);
      localStorage.setItem('dataCollection',JSON.stringify(collectionData));
      this.route.navigate(['user/project/data_collection']);
    }
  }

}
