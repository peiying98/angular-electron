import { Component, OnInit, Input } from '@angular/core';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Input() CanvasID;
  @Input() userID;
  @Input() adminID;
  @Input() Title;
  @Input() ProblemStatement;
  participants:any=[];
  cache:any;
  CanvasData:any;
  overviewForm: FormGroup;

  constructor(
    private tool: ToolkitService,
    public fb: FormBuilder,
  ) { 
    
  }

  ngOnInit() {
    this.overviewForm = this.fb.group({
      'title': ['', [
      Validators.required
      ]],
      'prob': ['', [
        Validators.required
        ]],
    
   
  });

  this.tool.getCanvasParticipants(this.CanvasID).pipe().subscribe(data=>{
    this.participants = data['participantsID']
  })


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

  get title() { return this.overviewForm.get('title') }
  get prob() { return this.overviewForm.get('prob') }

  cardEdit(value){
    event.preventDefault();
    if(value === 'title'){
      this.cache = this.Title;
    }else if(value === 'prob'){
      this.cache = this.ProblemStatement;
    }

    if (this.cache !== '' && this.cache !== null && this.cache !== undefined ){
      $(`textarea[name=${value}]`).val(`${this.cache}`)
    }else{
      $(`textarea[name=${value}]`).val('');
    }
    $(`#overview-${value}-form`).show();
    $(`#overview-${value}-edit`).show();
    $(`#overview-${value}`).hide();
    $(`textarea[name=${value}]`).focus();
    $(`#overview-${value}-form`).focusout(()=>{
      $(`#overview-${value}`).show();
      $(`#overview-${value}-form`).hide();
      $(`#overview-${value}-edit`).hide();
      $(`textarea[name=overview-${value}]`).val('');
    })
  }

  cardEnter(value){
    event.preventDefault();
    if(value === 'title' && this.title.value !== '' &&  this.title.value !== null){
      this.tool.editCanvasMetaData(this.CanvasID, this.adminID, this.participants, {Title: this.title.value})
    }else if(value === 'prob' && this.prob.value !== '' &&  this.prob.value !== null){
      this.tool.editCanvasMetaData(this.CanvasID, this.adminID, this.participants, {ProblemStatement: this.prob.value})
    }
    $(`#overview-${value}`).show();
    $(`#overview-${value}-form`).hide();
    $(`#overview-${value}-edit`).hide();
    $(`textarea[name=overview-${value}`).val('').focusout();

    this.overviewForm.reset();
  }



 
}
