import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
import { BuiltinType, IfStmt } from '@angular/compiler';
import {AuthService} from '../../../service/auth.service';
// import {gibberish} from 'gibberish-detector'
// import * as gibberish from 'gibberish-detector'
declare var require: any;
var gibberish = require('gibberish-detector');

@Component({
  selector: 'app-bmc',
  templateUrl: './bmc.component.html',
  styleUrls: ['./bmc.component.css']
})
export class BmcComponent implements OnInit{

  show: boolean = false;
  CanvasData: any;
  bmcForm: FormGroup;
  DescForm: FormGroup;
  KPCol:any;
  KACol:any;
  KRCol:any;
  VPCol:any;
  CRCol:any;
  CHCol:any;
  CSCol:any;
  CostCol:any;
  RevCol:any;
  KPLength:any;
  KALength:any;
  KRLength:any;
  VPLength:any;
  CRLength:any;
  CHLength:any;
  CSLength:any;
  CostLength:any;
  RevLength:any;
  gainpainRatio: any;
  gainpainMessage: any;
  gainLength:any;
  inertiaLength:any;
  painLength:any;
  spamMsg: any;
  mobile: any;
  metric: boolean = true;
  gainAnalysis:any;
  inertiaAnalysis:any;
  painAnalysis:any;
  mr: NgbModalRef;
  object:any;
  objectType:any;
  objectID:any;
  numEvidences:any;
  numC:any;
  numLC:any;
  numN:any;
  numLD:any;
  numD:any;
  desc:any;
  numAnomV:any;
  numRegV:any;
 valData:any=[];
 titleContent:any;
  
  @Input() CanvasID;
  @Input() Title;
  @Input() UserName;
  
    constructor(
      private http: HttpClient,
      private tool: ToolkitService,
      public fb: FormBuilder,
      public modalService: NgbModal,
      private auth: AuthService,
      
    ) { 

      // this.http.get<{ip:string}>('https://jsonip.com')
      // .subscribe( data => {
      //   this.ipAddress = data.ip;
      // })
    

      this.auth.getUser().pipe().subscribe(user=>{
      
     
        if(user.uid){
          this.tool.countVisitor(this.CanvasID, user.uid)
        }else{
            this.tool.countVisitor(this.CanvasID, '')
          }
   
      });

    

     
    }
  
      ngOnInit() {

        this.tool.getAnomVisitor(this.CanvasID).pipe().subscribe(data=>{
          if (data['length']){
           this.numAnomV = data['length']
          }else{
            this.numAnomV = 0;
          }

          
        })

        this.tool.getRegVisitor(this.CanvasID).pipe().subscribe(data=>{
          if (data['length']){
           this.numRegV = data['length']
          }else{
            this.numRegV = 0;
          }

        })


      // this.http.get('https://newsapi.org/v2/everything?q=bitcoin&apiKey=bc0737a7d3b74732b830963f306e485a')
      // .subscribe(
      //    data => console.log(data)
      // );
      if($(window).width() <= 800){
        this.mobile=true;
      }else{
        this.mobile=false;
      }

      // initiatlise the BMC data per column
      this.tool.getKP(this.CanvasID).pipe().subscribe(data=>{
        this.KPCol = data;
        this.KPLength = data['length'];
        // $(`#KP`).scrollTop(5000);
      });

      this.tool.getKA(this.CanvasID).pipe().subscribe(data=>{
        this.KACol = data;
        this.KALength = data['length'];
        // $(`#KA`).scrollTop(5000);
      });

      this.tool.getKR(this.CanvasID).pipe().subscribe(data=>{
        this.KRCol = data;
        this.KRLength = data['length'];
        // $(`#KR`).scrollTop(5000);
      });

      this.tool.getVP(this.CanvasID).pipe().subscribe(data=>{
        this.VPCol = data;
        this.VPLength = data['length'];
        // $(`#VP`).scrollTop(5000);
      });

      this.tool.getCR(this.CanvasID).pipe().subscribe(data=>{
        this.CRCol = data;
        this.CRLength = data['length'];
        // $(`#CR`).scrollTop(5000);
      });

      this.tool.getCH(this.CanvasID).pipe().subscribe(data=>{
        this.CHCol = data;
        this.CHLength = data['length'];
        // $(`#CH`).scrollTop(5000);
      });

      this.tool.getCS(this.CanvasID).pipe().subscribe(data=>{
        this.CSCol = data;
        this.CSLength = data['length'];
        // $(`#CS`).scrollTop(5000);
      });

      this.tool.getCost(this.CanvasID).pipe().subscribe(data=>{
        this.CostCol = data;
        this.CostLength = data['length'];
        // $(`#Cost`).scrollTop(5000);
      });

      this.tool.getRev(this.CanvasID).pipe().subscribe(data=>{
        this.RevCol = data;
        this.RevLength = data['length'];
        // $(`#Rev`).scrollTop(5000);
      });
  
      this.bmcForm = this.fb.group({
        'KP': ['', [
        Validators.required
        ]],
        'KA': ['', [
          Validators.required
        ]],
        'KR': ['', [
          Validators.required
        ]],
        'VP': ['', [
          Validators.required
        ]],
        'CR': ['', [
          Validators.required
        ]],
        'CH': ['', [
          Validators.required
        ]],
        'CS': ['', [
          Validators.required
        ]],
        'Cost': ['', [
          Validators.required
        ]],
        'Rev': ['', [
          Validators.required
        ]],
     
    });
    this.DescForm = this.fb.group({
      'Desc': ['', [
      Validators.required
      ]],
    
   
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
  
    ngOnChanges(){
      this.CanvasData = this.tool.getCanvasData(this.CanvasID)
     
    }
  
    // bmcform
   get KP() { return this.bmcForm.get('KP') }
   get KA() { return this.bmcForm.get('KA') }
   get KR() { return this.bmcForm.get('KR') }
   get VP() { return this.bmcForm.get('VP') }
   get CR() { return this.bmcForm.get('CR') }
   get CH() { return this.bmcForm.get('CH') }
   get CS() { return this.bmcForm.get('CS') }
   get Cost() { return this.bmcForm.get('Cost') }
   get Rev() { return this.bmcForm.get('Rev') }

  //  DescForm
  get Desc() { return this.DescForm.get('Desc') }
  
  showToolTip(type){
    $(`#${type}ToolTipText`).slideDown(300, ()=>{
      // setTimeout(()=>{
      //   $(`#${type}ToolTipText`).slideUp()
      // },3000);
    });
  }
  
  hideToolTip(type){
    $(`#${type}ToolTipText`).slideUp(300, ()=>{
      // setTimeout(()=>{
      //   $(`#${type}ToolTipText`).slideUp()
      // },3000);
    });
  }
  
  inputCol(type){
    event.preventDefault();
    $(`#add-${type}-form`).show();
    $(`textarea[name='${type}']`).focus();
    $(`#add-${type}-btn`).hide();
    $(`textarea[name='${type}']`).focusout(()=>{
      this.enter(type);
    $(`textarea[name='${type}']`).val('');
      $(`#add-${type}-form`).hide();
      $(`#add-${type}-btn`).show();
    });
  }

  open(content, object, objectID, type) {
 
    this.numEvidences = 0;
    this.desc = '';
    this.titleContent= '';
    this.tool.totalEvidences(this.CanvasID, objectID, type);
    this.tool.getCardData(this.CanvasID, objectID, type).pipe().subscribe(data=>{
      if(data !== undefined){
        this.desc = data['description'];
        this.numC = data['Confirming'];
        this.numLC = data['Leaning Confirming'];
        this.numN = data['Neutral'];
        this.numLD = data['Leaning Disconfirming'];
        this.numD = data['Disconfirming'];
        this.numEvidences = data['numEvidences'];
        // this.valData= [
        //   data['Disconfirming'],
        //   data['Leaning Disconfirming'],
        //   data['Neutral'],
        //   data['Leaning Confirming'],
        //   data['Confirming']
        //  ]
      }

    })

    this.object = object;
    this.objectType = type;
    this.objectID = objectID;
    this.titleContent = object.content;
  
    this.mr = this.modalService.open(content);

  
   
  }


  cardEnter(objectID, objectType){
    event.preventDefault();
    var value = this.Desc.value;
    if(value !== '' &&  value !== null){
      this.tool.addCardDesc(this.CanvasID, objectID, objectType, value);
      this.tool.getCardData(this.CanvasID, objectID, objectType).pipe().subscribe(data=>{
        if(data){
          this.desc = data['description']
        }
        
      })
  }
    $(`#desc`).show();
    $(`#desc-form`).hide();
    $(`textarea[name=Desc`).val('').focusout();
    this.DescForm.reset();
  }

  cardEdit(){
    event.preventDefault();
    this.tool.getCardData(this.CanvasID, this.objectID, this.objectType).pipe().subscribe(data=>{
      if(data){
        this.desc = data['description']
      }
    })
    if (this.desc !== '' && this.desc !== null && this.desc !== undefined ){
      $(`textarea[name=Desc]`).val(`${this.desc}`)
    }else{
      $(`textarea[name=Desc]`).val('');
    }
    $(`#desc-form`).show();
    $(`#desc`).hide();
    $(`textarea[name=Desc]`).focus();
    $(`#desc-form`).focusout(()=>{
      $(`#desc`).show();
      $(`#desc-form`).hide();
      $(`textarea[name=Desc]`).val('');
    })
  }

  modalEdit(){
    event.preventDefault();
    $(`textarea[name=${this.objectType}]`).val(`${this.titleContent}`)
    $(`#show-modal-form`).show();
    $(`#modal`).hide();
    $(`textarea[name=${this.objectType}]`).focus();
    $(`#show-modal-form`).focusout(()=>{
      $(`#modal`).show();
      $(`#show-modal-form`).hide();
      $(`textarea[name=${this.objectType}]`).val('');
    })

  }

  addEvidence(){
    $('#bmc-credits').hide();
    $('#bmcCanvas').hide();
    $('#addEvidence').hide();
    $('#shareLink').hide();
    $('#evidence').show();
    $('#showBMC').show();
    if (this.mr){
      this.mr.close();
    }
    
  }

  showBMC(){
    $('#evidence').hide();
    $('#showBMC').hide();
    $('#bmcCanvas').show();
    $('#addEvidence').show();
    $('#bmc-credits').show();
    $('#shareLink').show();
  }

  exit(type){
    
    $(`#add-${type}-form`).hide();
    $(`#add-${type}-btn`).show();
    $(`textarea[name='${type}']`).val('').focusout();
 
  }
  
enter(type){
  event.preventDefault();

  var value = '' ;
  switch(type){
    case "KP":
      value = this.KP.value;
      this.KP.reset();
      break;
    case "KA":
      value = this.KA.value;
      this.KA.reset();
      break;
    case "KR":
      value = this.KR.value;
      this.KR.reset();
      break;
    case "VP":
      value = this.VP.value;
      this.VP.reset();
    break;
    case "CR":
      value = this.CR.value;
      this.CR.reset();
      break;
    case "CH":
      value = this.CH.value;
      this.CH.reset();
      break;
    case "CS":
      value = this.CS.value;
      this.CS.reset();
      break;
    case "Cost":
      value = this.Cost.value;
      this.Cost.reset();
      break;
    case "Rev":
      value = this.Rev.value;
      this.Rev.reset();
      break;
    default:
      break;
  }
  
  
  // console.log('here',gibberish.detect(value))

  // if (gibberish.detect(value) <=60 ){
    if(value !== '' &&  value !== null && value !==undefined){
    this.tool.enterBMC(this.CanvasID,{
      content: value,
      timeStamp: Date.now(),
      addedBy: this.UserName
    }, type)
    
    value = null;
  }
  $(`textarea[name='${type}']`).val('');
 
  }

  edit(id, type){
    event.preventDefault();
    
    let value ;
    switch(type){
      case "KP":
        value = this.KP.value;
        this.KP.reset();
        break;
      case "KA":
        value = this.KA.value;
        this.KA.reset();
        break;
      case "KR":
        value = this.KR.value;
        this.KR.reset();
        break;
      case "VP":
        value = this.VP.value;
        this.VP.reset();
      break;
      case "CR":
        value = this.CR.value;
        this.CR.reset();
        break;
      case "CH":
        value = this.CH.value;
        this.CH.reset();
        break;
      case "CS":
        value = this.CS.value;
        this.CS.reset();
        break;
      case "Cost":
        value = this.Cost.value;
        this.Cost.reset();
        break;
      case "Rev":
        value = this.Rev.value;
        this.Rev.reset();
        break;
      default:
        break;
    }
    
    
    // console.log('here',gibberish.detect(value))
    
    // if (gibberish.detect(value) <=60 ){
      if(value !== '' &&  value !== null){
      
      this.tool.editBMC(this.CanvasID,{
        content: value,
      }, id, type)
      this.titleContent = value;
      value = null;
    }
    $(`textarea[name='${type}']`).val('').focusout();
  
    }
  
  
  
  openMetric(){
  if(this.metric){
    $('#mobileMetricCol').slideDown()
  this.metric = !this.metric
  }else{
    {
      $('#mobileMetricCol').slideUp()
    this.metric = !this.metric
    }
  }
  }



  // showEditIcon(type,id){
  //   $(`#${type}-edit-${id}`).show();
  // }
  
  // hideEditIcon(type,id){
  //   $(`#${type}-edit-${id}`).hide();
  // }
  
  showEditForm(item , type){
    $(`textarea[name='${type}']`).val(`${item.content}`)
    $(`#${item.ID}editform`).show();
    $(`#add-${type}-btn`).show();
    $(`#${item.ID}`).hide();
    $(`#add-${type}-form`).hide();
    $(`textarea[name='${type}']`).focus()
    $(`#${item.ID}editform`).focusout(()=>{
      $(`#${item.ID}`).show();
      $(`#${item.ID}editform`).hide();
      $(`textarea[name='${type}']`).val('');
    })
  }

  deleteCard(id, type){
    var value;
    switch(type){
      case "KP":
        value = 'KEY PARTNERS'
        break;
      case "KA":
        value = 'KEY ACTIVITIES'
        break;
      case "KR":
        value = 'KEY RESOURCES'
        break;
      case "VP":
        value = 'VALUE PROPOSITIONS'
      break;
      case "CR":
        value = 'CUSTOMER RELATIONSHIPS'
        break;
      case "CH":
        value = 'CHANNELS'
        break;
      case "CS":
        value = 'CUSTOMER SEGMENTS'
        break;
      case "Cost":
        value = 'COST STRUCTURE'
        break;
      case "Rev":
        value = 'REVENUE STREAMS'
        break;
      default:
        break;
    }
    if (confirm(`Are you sure you want to delete ${this.titleContent} from ${value}? All information associated to this evidence will be permanently deleted. This operation cannot be undone.`)){
      this.titleContent = '';
      this.tool.deleteBMC(this.CanvasID, id, type);
      this.mr.close();
    }
 
  }
  
  removeGain(item){
    this.tool.removeGain(this.CanvasID,item.ID)
 
  }
  removeInertia(item){
    this.tool.removeInertia(this.CanvasID,item.ID)
    
  }
  removePain(item){
    this.tool.removePain(this.CanvasID,item.ID)
   
  }
  
  showDel(item){
    $(`#${item.ID}trashBtn`).slideUp(()=>{
      $(`#${item.ID}delDiv`).slideDown();
    });
  }
  hideDel(item) {
    $(`#${item.ID}delDiv`).slideUp(()=>{
      $(`#${item.ID}trashBtn`).slideDown();
    });
  }
  deleteItem(item, type){
    if (type=='gain'){ 
      this.tool.removeGain(this.CanvasID,item.ID)
   
    }
    if (type=='pain'){  
      this.tool.removePain(this.CanvasID,item.ID)
     
     }
    if (type=='inertia'){ 
      this.tool.removeInertia(this.CanvasID,item.ID)
    
     }
  }

  copyLink(){
    const el = document.createElement('textarea');
    el.value = `${window.location.origin}/canvas/view/${this.CanvasID}`;
    document.body.appendChild(el);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      var editable = el.contentEditable;
      var readOnly = el.readOnly;
  
      // convert to editable with readonly to stop iOS keyboard opening
      el.contentEditable = 'true';
      el.readOnly = true;

      // create a selectable range
      var range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    }else{
      el.select();
    }
    
    try {  
      // Now that we've selected the anchor text, execute the copy command 

      document.execCommand('copy');
      document.body.removeChild(el);
      $('#copyClipboard').text(`Copied!`);
    } catch(err) {  
      alert(err)  
    }  
    

  }

  openNav() {
    this.show = true;
        $('#myDiv').animate({
                'width': '20%',
                "opacity": "1",
                'display': 'block',
            },
            ()=>{
    document.getElementById("metric-btn").style.opacity = "0"
            } )
    
  
  }
  
  closeNav(){
    this.show = false;
    // document.getElementById("myDiv").style.width = "0px";
    $('#myDiv').animate({
            'width': '0%',
            "opacity": "0",
            'display': 'none'
        },
        () => {
          document.getElementById("metric-btn").style.opacity = "1"
        })
  }
  
  }
