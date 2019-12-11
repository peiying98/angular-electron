import { Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import * as $ from 'jquery';
import { element } from 'protractor';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements OnInit{
  @Input() CanvasID: any;
  @Input() Title;
  @Input() UserName;
  empty: boolean=true;
  
  mr: NgbModalRef;
  evidences: any;
  cardEvidences:any;
  // modalEvidence:any;
  numEvidences: any;

  constructor(
    public modalService: NgbModal,
    private tool: ToolkitService,
    public fb: FormBuilder
    ) { 
      
    }

  ngOnInit() {


    this.tool.getAllEvidences(this.CanvasID).pipe().subscribe(data=>{
      this.evidences = data;
      this.numEvidences = data['length'];
    });    

  

    $(document)
    .on('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });
  }



  open(content) {
    // this.modalEvidence = '';
    // if(this.subEvidences){
    //   this.subEvidences.unsubscribe();
    // }
    this.mr = this.modalService.open(content);  

  }


  


}

