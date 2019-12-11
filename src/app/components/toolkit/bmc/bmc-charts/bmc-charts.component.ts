import { Component, OnInit, Input,  ElementRef, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';
import {ToolkitService} from '../../../../service/toolkit/toolkit.service';
import { disableDebugTools } from '@angular/platform-browser';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import {AuthService} from '../../../../service/auth.service';

@Component({
  selector: 'app-bmc-charts',
  templateUrl: './bmc-charts.component.html',
  styleUrls: ['./bmc-charts.component.css']
})
export class BmcChartsComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;

  chart:any = [];
  selectedVal: any;
  CanvasData:any;
  participantsList:any;
  userid:any;
  evidences:any = [];
  mr: NgbModalRef;

  @Input() CanvasID;
  @Input() Title;
  @Input() UserName;
  @Input() type;
  @Input() typeID;
  @Input() numD;
  @Input() numLD;
  @Input() numN;
  @Input() numLC;
  @Input() numC;

  constructor(
    private elementRef: ElementRef,
    private tool: ToolkitService,
    public modalService: NgbModal,
    private auth: AuthService,
  ) { 

  }

  ngOnInit() {
    this.tool.getCanvasData(this.CanvasID).pipe().subscribe(data=>{
      this.CanvasData = data;
      this.participantsList = data['participantsID'].concat( [data['userID']])
    });
    this.auth.getUser().pipe().subscribe(user => {
      if(user){
        this.userid = user.uid;
      }
    });
    
    if(this.numD || this.numLD || this.numN || this.numLC || this.numC){
      // this.data = [this.numD, this.numLD, this.numN, this.numLC, this.numC];
     
      this.Chart();

    }else{
      this.selectedVal ='none';
      // this.emptyChart();
    }
    
  }

  Chart(){
   
    const el = <HTMLCanvasElement> document.getElementById('canvas');
    const ctx = el.getContext("2d");
    
    var myNewChart = new Chart(ctx, {
      type: 'horizontalBar',
      // type: 'doughnut',
      data: {
        // labels:["Disconfirming", "Leaning Disconfirming", "Neutral", "Leaning Confirming", "Confirming"],
        datasets: [
          {
            label: "Disconfirming",
            backgroundColor: "rgba(238, 57, 103, 0.4)",
            // borderColor: "rgba(117,61,41,1)",
            borderWidth: 1,
            data: [this.numD],
            stack: "s1"
          },
          {
            label: "Leaning Disconfirming",
            backgroundColor: "rgba(249, 159, 37, 0.4)",
            // borderColor: "rgba(117,61,41,1)",
            borderWidth: 1,
            data: [this.numLD],
            stack: "s1"
          },
          {
            label: "Neutral",
            backgroundColor: "rgba(254, 215, 16, 0.4)",
            // borderColor: "rgba(117,61,41,1)",
            borderWidth: 1,
            data: [this.numN],
            stack: "s1"
          },
          {
            label: "Leaning Confirming",
            backgroundColor: "rgba(126, 194, 65, 0.4)",
            // borderColor: "rgba(117,61,41,1)",
            borderWidth: 1,
            data: [this.numLC],
            stack: "s1"
          },
          {
            label: "Confirming",
            backgroundColor: "rgba(18, 129, 64, 0.4)",
            // borderColor: "rgba(117,61,41,1)",
            borderWidth: 1,
            data: [this.numC],
            stack: "s1"
          }
        ],
        
        // datasets: [{
        //     data: this.data,
        //     backgroundColor: [
        //       'rgba(238, 57, 103, 0.4)',
        //       'rgba(249, 159, 37, 0.4)',
        //       'rgba(254, 215, 16, 0.4)',
        //       'rgba(126, 194, 65, 0.4)',
        //       'rgba(18, 129, 64, 0.4)',
        //   ]
        // }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        // labels: [
        //   'Disconfirming',
        //   'Leaning Disconfirming',
        //   'Neutral',
        //   'Leaning Confirming',
        //    'Confirming',
        // ]
    },
    options: {
      // rotation: -Math.PI,
      // circumference: Math.PI,
    //   title:{
    //     display:true,
    //     text: 'Click on the bar to show evidences',
    //     fontFamily: 'lato',
    //     fontStyle: 'bolder',
    //     fontColor: '#11264b',
    //     fontSize: 15
    // },
      scales: { 
        xAxes: [{
        display: false,
    }],
        yAxes: [{
            display: false,
            maxBarThickness: 15,
        }]
    },
      tooltips: {
        mode: 'single',
        position: 'nearest',
        callbacks: {
          // label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`, 
          title: () => null,
      }
      },
      legend: {
        display: false,
      
    },
    hover: {
      onHover: function(e, el) {
        $("#canvas").css("cursor", el[0] ? "pointer" : "default");
      }
   },
    layout:{
      padding:{
        left: 10,
        right:10
      }
    },
    onClick: (evt)=> {
      this.evidences = []
      var activePoint = myNewChart.getDatasetAtEvent(evt)[0];
      if(activePoint){
        var data = activePoint['_model'].datasetLabel;
     
        if(data){
          this.selectedVal = data;
          this.loadEvidences(data);
  
        }
      }
    

    }
  }
  })
  

  this.chart = myNewChart;
 
  }

  loadEvidences(data){

    this.tool.getCardEvidence(this.CanvasID, this.typeID, this.type, data).pipe().subscribe(d=>{
      const arr = [];
      if(d.length === 0){
        this.evidences = [];
       }else{
        d.forEach(data=>{
       
          if(data['EvidenceID']){
           this.tool.getEvidence(this.CanvasID, data['EvidenceID'])
           .map(({keyInsights, EvidenceID})=> [keyInsights, EvidenceID])
           .pipe()
           .take(1)
           .subscribe(q=>{
             arr.push(q)
           })
           this.evidences = arr;
          }
        })
       }
    
  

      });

  }



  unLink(EvidenceID){
    var value;
    switch(this.type){
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
    if (confirm(`Are you sure you want to unlink this evidence from ${value}? This operation cannot be undone.`)){
      this.tool.delLink(this.CanvasID, EvidenceID, this.typeID, this.type, this.selectedVal).then(()=>{
              setTimeout(() => 
              {
                this.chart.update();
                this.Chart();
              },
              2000);
     
      })
       
    }

  }

  open(content) {
    this.mr = this.modalService.open(content);

  }


  // emptyChart(){
  //   const el = <HTMLCanvasElement> document.getElementById('canvas');
  //   const ctx = el.getContext("2d");
    
  //   this.chart = new Chart(ctx, {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [{
  //           data: [1],
  //       }],
  //       // These labels appear in the legend and in the tooltips when hovering different arcs
  
  //   },
  //   options: {
  //     rotation: -Math.PI,
  //     circumference:Math.PI,
  //     tooltips: { enabled: false,},
  // }
  // });
  // }

  // backup functions
  toggleTitle(data){
    this.chart.options ={
      // rotation: -Math.PI,
      // circumference: Math.PI,
      title:{
        display:true,
        text: data,
        fontFamily: 'lato',
        fontStyle: 'bolder',
        fontColor: '#11264b',
        fontSize: 15
    },
      scales: { 
        xAxes: [{
        display: false,
    }],
        yAxes: [{
            display: false,
            maxBarThickness: 15,
        }]
    },
      tooltips: {
        mode: 'single',
        position: 'nearest'
      },
      legend: {
        display: false,
      
    },
    layout:{
      padding:{
        left: 10,
        right:10,
      }
     
    } 
  }
  this.chart.update();
  }

  toggleLegend() {
    this.chart.options ={
      // rotation: -Math.PI,
      // circumference: Math.PI,
      scales: { 
        xAxes: [{
        display: false,
    }],
        yAxes: [{
            display: false,
            maxBarThickness: 10,
        }]
    },
      tooltips: {
        mode: 'single'
      },
      legend: {
        display:true,
        labels: {
          boxWidth: 10,
        }
      
    },
    layout: {
      padding: {
          left: 30,
          right: 0,
          top: 0,
          bottom: 0
      }
  }
  } 
  this.chart.update();

  }

  toggleOff() {
    this.chart.options ={
      // rotation: -Math.PI,
      // circumference: Math.PI,
      scales: { 
        xAxes: [{
        display: false,
    }],
        yAxes: [{
            display: false,
            maxBarThickness: 10,
        }]
    },
      tooltips: {
        mode: 'single'
      },
      legend: {
        display:false
      
    },
    layout: {
      padding: {
          left: 30,
          right: 0,
          top: 0,
          bottom: 0
      }
  }
  } 
  this.chart.update();
  }

}
