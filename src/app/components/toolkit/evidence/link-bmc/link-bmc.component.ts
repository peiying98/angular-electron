import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import {ToolkitService} from '../../../../service/toolkit/toolkit.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
import { BuiltinType } from '@angular/compiler';
// import {gibberish} from 'gibberish-detector'
// import * as gibberish from 'gibberish-detector'
declare var require: any;
var gibberish = require('gibberish-detector');

@Component({
  selector: 'app-link-bmc',
  templateUrl: './link-bmc.component.html',
  styleUrls: ['./link-bmc.component.css']
})
export class LinkBmcComponent implements OnInit {

  show: boolean = false;
  CanvasData: any;
  bmcForm: FormGroup;
  KPCol:any;
  KACol:any;
  KRCol:any;
  VPCol:any;
  CRCol:any;
  CHCol:any;
  CSCol:any;
  CostCol:any;
  RevCol:any;
  spamMsg: any;
  mobile: any;
  metric: boolean = true;
  mr: NgbModalRef;
  contentID:any;
  contentValue:any;
  contentType:any;
  TypeName: any;
  Validation: any;
  cacheLink: any= [];
  cacheC:any = [];
  cacheLC:any = [];
  cacheN:any= []; 
  cacheLD:any= [];
  cacheD:any= [];
  cardColor:any;
  status:any = 'waiting';
  
  @Input() CanvasID;
  @Input() Title;
  @Input() UserName;
  @Input() EvidenceID;
  @Input() EvidenceIS;
  @Input() IntervBy;
  
    constructor(
      private http: HttpClient,
      private tool: ToolkitService,
      public fb: FormBuilder,
      public modalService: NgbModal,
    ) {
  
     }
  
      ngOnInit() {
  
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
         
            // $(`#KP`).scrollTop(5000);
          });
    
          this.tool.getKA(this.CanvasID).pipe().subscribe(data=>{
            this.KACol = data;
       
            // $(`#KA`).scrollTop(5000);
          });
    
          this.tool.getKR(this.CanvasID).pipe().subscribe(data=>{
            this.KRCol = data;
  
            // $(`#KR`).scrollTop(5000);
          });
    
          this.tool.getVP(this.CanvasID).pipe().subscribe(data=>{
            this.VPCol = data;
    
            // $(`#VP`).scrollTop(5000);
          });
    
          this.tool.getCR(this.CanvasID).pipe().subscribe(data=>{
            this.CRCol = data;

            // $(`#CR`).scrollTop(5000);
          });
    
          this.tool.getCH(this.CanvasID).pipe().subscribe(data=>{
            this.CHCol = data;
   
            // $(`#CH`).scrollTop(5000);
          });
    
          this.tool.getCS(this.CanvasID).pipe().subscribe(data=>{
            this.CSCol = data;
  
            // $(`#CS`).scrollTop(5000);
          });
    
          this.tool.getCost(this.CanvasID).pipe().subscribe(data=>{
            this.CostCol = data;

            // $(`#Cost`).scrollTop(5000);
          });
    
          this.tool.getRev(this.CanvasID).pipe().subscribe(data=>{
            this.RevCol = data;

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
            // pre-loading caches
            this.loadSelected('Confirming');
            this.loadSelected('Leaning Confirming');
            this.loadSelected('Neutral');
            this.loadSelected('Leaning Disconfirming');
            this.loadSelected('Disconfirming');

    }
  
    ngOnChanges(){
      this.CanvasData = this.tool.getCanvasData(this.CanvasID)
  
    }
  
   get KP() { return this.bmcForm.get('KP') }
   get KA() { return this.bmcForm.get('KA') }
   get KR() { return this.bmcForm.get('KR') }
   get VP() { return this.bmcForm.get('VP') }
   get CR() { return this.bmcForm.get('CR') }
   get CH() { return this.bmcForm.get('CH') }
   get CS() { return this.bmcForm.get('CS') }
   get Cost() { return this.bmcForm.get('Cost') }
   get Rev() { return this.bmcForm.get('Rev') }
  
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
    $(`#add-${type}-form`).show();
    $(`textarea[name='${type}']`).focus();
    $(`#add-${type}-btn`).hide();
    
    // $(`textarea[name='${type}']`).focusout(()=>{
    //   $(`#add-${type}-form`).hide();
    //   $(`#add-${type}-btn`).show();
    // })
  
  }

  
  openBMC(content) {
    this.mr = this.modalService.open(content);
  }
  open(content, contentValue, contentID, type) {
    this.mr = this.modalService.open(content);
    this.contentID = contentID;
    this.contentValue = contentValue;
    this.contentType = type;

    switch(type){
      case "KP":
        this.TypeName = "KEY PARTNERS";
      break;
      case "KA":
      this.TypeName = "KEY ACTIVITIES";
    break;
    case "KR":
    this.TypeName = "KEY RESOURCES";
  break;
      case "VP":
        this.TypeName = "VALUE PROPOSITIONS";
      break;
      case "CR":
      this.TypeName = "CUSTOMER RELATIONSHIPS";
    break;
    case "CH":
    this.TypeName = "CHANNELS";
  break;
      case "CS":
      this.TypeName = "CUSTOMER SEGMENTS";
    break;
    case "Cost":
    this.TypeName = "COST STRUCTURE";
  break;
      case "Rev":
      this.TypeName = "REVENUE STREAMS";
    break;
  
      default:
      break;
  
  
    }
  }


  addEvidence(){
    $('#bmcCanvas').hide();
    $('#addEvidence').hide();
    $('#evidence').show();
    $('#showBMC').show();
  }

  showBMC(){
    $('#evidence').hide();
    $('#showBMC').hide();
    $('#bmcCanvas').show();
    $('#addEvidence').show();
  }

  exit(type){
    $(`#add-${type}-form`).hide();
    $(`#add-${type}-btn`).show();
    $(`textarea[name='${type}']`).val('').focusout();
 
  }
  
  enter(type){
  
  let value ;
  switch(type){
    case "KP":
      value = this.KP.value;
    break;
    case "KA":
    value = this.KA.value;
  break;
  case "KR":
  value = this.KR.value;
break;
    case "VP":
      value = this.VP.value;
    break;
    case "CR":
    value = this.CR.value;
  break;
  case "CH":
  value = this.CH.value;
break;
    case "CS":
    value = this.CS.value;
  break;
  case "Cost":
  value = this.Cost.value;
break;
    case "Rev":
    value = this.Rev.value;
  break;

    default:
    break;


  }
  
  
  // console.log('here',gibberish.detect(value))
  
  // if (gibberish.detect(value) <=60 ){
    if(value !== '' ||  value !== null){
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
  
    let value ;
    switch(type){
      case "KP":
      value = this.KP.value;
    break;
    case "KA":
    value = this.KA.value;
  break;
  case "KR":
  value = this.KR.value;
break;
    case "VP":
      value = this.VP.value;
    break;
    case "CR":
    value = this.CR.value;
  break;
  case "CH":
  value = this.CH.value;
break;
    case "CS":
    value = this.CS.value;
  break;
  case "Cost":
  value = this.Cost.value;
break;
    case "Rev":
    value = this.Rev.value;
  break;
  
      default:
      break;
  
  
    }
    
    
    // console.log('here',gibberish.detect(value))
    
    // if (gibberish.detect(value) <=60 ){
      if(value !== '' ||  value !== null){
      this.tool.editBMC(this.CanvasID,{
        content: value,
      }, id, type)
      value = null;
    }
    $(`textarea[name='${type}']`).val('');
  
    }

    linkBMC( contentID, contentType){
 
        if(!this.Validation){
          this.status = '';
        }else if(this.cacheLink.includes(contentID)){
     
          this.status = this.Validation;
          this.tool.delLink(this.CanvasID, this.EvidenceID, contentID, contentType, this.Validation);
          this.cacheLink.splice( this.cacheLink.indexOf(contentID), 1 );
         

        }else{
          this.status = this.Validation;
          this.tool.linkEvidence(
            this.CanvasID, 
            this.UserName, 
            this.EvidenceID, 
            contentID, 
            contentType, 
            this.Validation);
      
    
          switch(this.Validation){
            case "Confirming":
            this.cacheLink = this.cacheC;
            this.cacheLink.push(contentID);
            // this.loadSelected('Confirming');
          break;
          case "Leaning Confirming":
          this.cacheLink = this.cacheLC;
          this.cacheLink.push(contentID);
          // this.loadSelected('Leaning Confirming');
        break;
        case "Neutral":
        this.cacheLink = this.cacheN;
        this.cacheLink.push(contentID);
        // this.loadSelected('Neutral');
        break;
          case "Leaning Disconfirming":
          this.cacheLink = this.cacheLD;
          this.cacheLink.push(contentID);
          // this.loadSelected('Leaning Disconfirming');
          break;
          case "Disconfirming":
          this.cacheLink = this.cacheD;
          this.cacheLink.push(contentID);
          // this.loadSelected('Disconfirming');
    
        break;
    
        
            default:
            break;
          }
        }
 
        this.loadSelected('Confirming');
        this.loadSelected('Leaning Confirming');
        this.loadSelected('Neutral');
        this.loadSelected('Leaning Disconfirming');
        this.loadSelected('Disconfirming');

      }
    
      isValSelected(){
        this.status = this.Validation;
      }

    selectVal(value){
      this.status =  value;
      if (this.Validation !== value){
 
        this.Validation = value;
        switch(value){
          case "Confirming":
          this.cardColor = 'rgba(18, 129, 64, 0.4)';
          this.cacheLink = this.cacheC;
        break;
        case "Leaning Confirming":
        this.cardColor = 'rgba(126, 194, 65, 0.4)';
        this.cacheLink = this.cacheLC;
      break;
      case "Neutral":
      this.cardColor = 'rgba(254, 215, 16, 0.4)';
      this.cacheLink = this.cacheN;
      break;
        case "Leaning Disconfirming":
        this.cardColor = 'rgba(249, 159, 37, 0.4)';
        this.cacheLink = this.cacheLD;
        break;
        case "Disconfirming":
        this.cardColor = 'rgba(238, 57, 103, 0.4)';
        this.cacheLink = this.cacheD;
      break;
  
      
          default:
          break;
        }
      }else{
        this.status ='waiting';
        this.Validation = '';
        this.cacheLink = [];
      }

    }
      
    loadSelected(validation){
      const array =[];

      this.tool.getAllValidation(this.CanvasID, validation, this.EvidenceID).get().then((querySnapshot) => { 
        querySnapshot.forEach((doc) => {
          array.push(doc.id);
          switch(validation){
            case "Confirming":
            this.cacheC = array;
          break;
          case "Leaning Confirming":
          this.cacheLC = array;
        break;
        case "Neutral":
        this.cacheN = array;
      break;
          case "Leaning Disconfirming":
          this.cacheLD = array;
          break;
          case "Disconfirming":
          this.cacheD = array;
        break;
  
            default:
            break;
        
        
          }
          
        })
        switch(validation){
          case "Confirming":
          this.cacheC = array;
        break;
        case "Leaning Confirming":
        this.cacheLC = array;
      break;
      case "Neutral":
      this.cacheN = array;
    break;
        case "Leaning Disconfirming":
        this.cacheLD = array;
        break;
        case "Disconfirming":
        this.cacheD = array;
      break;

          default:
          break;
      
      
        }

     });
    }

 

    isSelected(contentID){
      
      if(contentID && this.Validation && contentID !== undefined){

        switch(this.Validation){
          case "Confirming":
          return this.cacheC.includes(contentID);
      
        case "Leaning Confirming":
        return this.cacheLC.includes(contentID);

      case "Neutral":
      return this.cacheN.includes(contentID);
 
        case "Leaning Disconfirming":
        return this.cacheLD.includes(contentID);

        case "Disconfirming":
        return this.cacheD.includes(contentID);

          default:
          break;
        }
      }else{
        return false;
      }
  
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
    $(`#${item.ID}`).hide();
    $(`textarea[name='${type}']`).focus()
    $(`#${item.ID}editform`).focusout(()=>{
      $(`#${item.ID}`).show();
      $(`#${item.ID}editform`).hide();
    })
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

