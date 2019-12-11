import { Component, OnInit, Input} from '@angular/core';
import * as $ from 'jquery';
import {ToolkitService} from '../../../../service/toolkit/toolkit.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons,NgbDateStruct ,NgbModalRef, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../../service/auth.service';

@Component({
  selector: 'app-evidence-card',
  templateUrl: './evidence-card.component.html',
  styleUrls: ['./evidence-card.component.css']
})
export class EvidenceCardComponent implements OnInit {
  @Input() CanvasID: any;
  @Input() Title;
  @Input() UserName;
  @Input() EvidenceID:any;
  @Input() mr: any;
  participantsList:any;
  userid:any;
  evidence:any;
  editEvidenceForm: FormGroup;
  // evidence:any

  constructor(
    public modalService: NgbModal,
    private tool: ToolkitService,
    public fb: FormBuilder,
    private auth: AuthService,
  ) { }

  ngOnInit() {

    this.tool.getCanvasData(this.CanvasID).pipe().subscribe(data=>{
      this.participantsList = data['participantsID'].concat( [data['userID']])
    });
    
    this.auth.getUser().pipe().subscribe(user => {
      if(user){
        this.userid = user.uid;
      }
    });

    const subEvidence = this.tool.getEvidence(this.CanvasID, this.EvidenceID).pipe().subscribe(data=>{
      this.evidence = data;
    });

    this.mr.result.then(() => {
    subEvidence.unsubscribe();
      // this.evidence = {};
      // console.log(this.evidence, 'close')

    }, (reason) => {
      subEvidence.unsubscribe()
      // this.evidence = {};
      // console.log(this.evidence, 'hellow')
    
    });

    this.editEvidenceForm = this.fb.group({
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

  get typeOf() { return this.editEvidenceForm.get('typeOf') }
  get name() { return this.editEvidenceForm.get('interv_name')}
  get email() { return this.editEvidenceForm.get('interv_email') }
  get intervBy() { return this.editEvidenceForm.get('interv_by') }
  get date() { return this.editEvidenceForm.get('interv_date')}
  get keyInsights() { return this.editEvidenceForm.get('keyInsights') }
  get notes() { return this.editEvidenceForm.get('interv_notes') }
  get link() { return this.editEvidenceForm.get('link') }

  openEdit(content,value){
  

    $(`#${value}`).hide();
    $(`#edit-${value}`).show();

    if(value === 'date'){
  
      this.editEvidenceForm.get('interv_date').setValue(content.date);
      $(`#edit-date`).focus();
    }else{
      $(`textarea[name=${value}]`).val(`${content}`).focus();
        $(`textarea[name=${value}]`).focusout(()=>{
      $(`#edit-${value}`).hide();
      $(`#${value}`).show();

    });
    }
  
  }

  edit(EvidenceID, type, value){
  
    if (value !== '' && value !== null){
      const data = {
        [type]: value
      }
      this.tool.editEvidence(this.CanvasID, EvidenceID, data);
      $(`#edit-${type}`).hide();
      $(`#${type}`).show();
      
      $(`textarea[name=${type}]`).val(``).focusout();
      this.editEvidenceForm.reset();

      
    }else{
      $(`#edit-${type}`).hide();
      $(`#${type}`).show();
      $(`textarea[name=${type}]`).focusout();
    }
    
 
  }


  delEvidence(id, value){
    if (confirm(`Are you sure you want to delete ${value} evidence? All information associated to this evidence will be permanently deleted. This operation cannot be undone.`)){
      this.tool.delEvidence(this.CanvasID, id);
      this.mr.close();
    }
  }

  closeModal(){
    return this.mr.close();
  }

}
