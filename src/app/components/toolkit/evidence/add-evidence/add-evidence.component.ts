import { Component, Input, OnInit } from '@angular/core';
import {ToolkitService} from '../../../../service/toolkit/toolkit.service';
import {NgbModal, ModalDismissReasons, NgbModalRef, NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import * as $ from 'jquery'

@Component({
  selector: 'app-add-evidence',
  templateUrl: './add-evidence.component.html',
  styleUrls: ['./add-evidence.component.css']
})
export class AddEvidenceComponent implements OnInit {

  @Input() CanvasID: any;
  @Input() Title;
  @Input() UserName;
  empty: boolean=true;
  newEvidenceForm: FormGroup;
  mr: NgbModalRef;
  evidences:any;
  interviewType:any;

  constructor(
    public modalService: NgbModal,
    private tool: ToolkitService,
    public fb: FormBuilder,
    ) { 
  }

  ngOnInit() {

    this.newEvidenceForm = this.fb.group({
      'typeOf': ['', [
        Validators.maxLength(100)
        ]
      ],
      'interv_name': ['', [
        Validators.maxLength(100)
        ]
      ],
      'interv_email': ['', [
        Validators.maxLength(100)
        ]
      ],
      'interv_by': ['', [
        Validators.maxLength(100)
        ]
      ],
      'interv_date': ['', [
        Validators.maxLength(100)
        ]
      ],
      'keyInsights': ['', [
        Validators.maxLength(100)
        ]
      ],
      'interv_notes': ['', [
        Validators.maxLength(100)
        ]
      ],
      'link': ['', [
        Validators.maxLength(100)
        ]
      ]
    });
  }
  get typeOf() { return this.newEvidenceForm.get('typeOf') }
  get name() { return this.newEvidenceForm.get('interv_name')}
  get email() { return this.newEvidenceForm.get('interv_email') }
  get intervBy() { return this.newEvidenceForm.get('interv_by') }
  get date() { return this.newEvidenceForm.get('interv_date')}
  get keyInsights() { return this.newEvidenceForm.get('keyInsights') }
  get notes() { return this.newEvidenceForm.get('interv_notes') }
  get link() { return this.newEvidenceForm.get('link') }

  open(content, interviewType) {
    this.mr = this.modalService.open(content);
    this.interviewType = interviewType;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${date.day ? date.day : ''}-${date.month ? date.month : ''}-${date.year}` :
        '';
  }

  


  addNewEvd() {
    let data;
    if(this.interviewType === 'secondary'){

      data = {
        typeOf: this.interviewType,
        intervBy: this.UserName,
        keyInsights: this.keyInsights.value,
        notes: this.notes.value,
        link: this.link.value,
        addedBy: this.UserName,
        timeStamp: Date.now()
      }

      if (this.link.value !== '' && this.keyInsights.value !== '' && 
      this.link.value !== null && this.keyInsights.value !== null){
    
        this.tool.addEvidence(this.CanvasID, data);
        this.newEvidenceForm.reset();
        $('#doneMsg').slideDown(500, () => {
          setTimeout(() => {
       
              $('#doneMsg').slideUp(500);
            
          }, 1000);
        });
      }else{
        $('#undoneMsg').slideDown(500, () => {
          setTimeout(() => {
       
              $('#undoneMsg').slideUp(500);
            
          }, 1000);
        });
      }

   
    } else{

      data = {
        typeOf: this.interviewType,
        name: this.name.value,
        email: this.email.value,
        intervBy: this.intervBy.value,
        date: this.date.value,
        keyInsights: this.keyInsights.value,
        notes: this.notes.value,
        addedBy: this.UserName,
        timeStamp: Date.now()
      }
      if (this.name.value !== null && this.keyInsights.value !== null && 
        this.name.value !== '' && this.keyInsights.value !== '' && 
        this.email.value !== null && this.email.value !== ''&& 
        this.intervBy.value !== null && this.intervBy.value !== ''&& 
        this.date.value !== null && this.date.value !== ''){

        this.tool.addEvidence(this.CanvasID, data);
        this.newEvidenceForm.reset();
        $('#doneMsg').slideDown(500, () => {
          setTimeout(() => {
       
              $('#doneMsg').slideUp(500);
            
          }, 1000);
        });
      }else{
        $('#undoneMsg').slideDown(500, () => {
          setTimeout(() => {
       
              $('#undoneMsg').slideUp(500);
            
          }, 1000);
        });
      }
      }

     
    
 
   
  

  }
}
