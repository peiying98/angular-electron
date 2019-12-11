import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-gainpainratio',
  templateUrl: './gainpainratio.component.html',
  styleUrls: ['./gainpainratio.component.css']
})
export class GainpainratioComponent implements OnInit {
@Input() GainVal;
@Input() PainVal;
@Input() GainAnalysis;
@Input() PainAnalysis;
ratio: any = 0;
ratioAnalysis: any = 0;

gainpainMessage: string;
analysisMessage:string;
  constructor() { }

  ngOnInit() {
  }
  
  ngOnChanges() {
    if (!this.GainVal || !this.GainAnalysis){
      this.ratio = 0;
      this.ratioAnalysis = 0;
    }else{
      this.ratio = this.GainVal / this.PainVal;
      this.ratioAnalysis = Math.abs(this.GainAnalysis / this.PainAnalysis);
    }
    
   

    if(this.GainVal/this.PainVal <= 3 && this.GainVal / this.PainVal >= 0)
    {
      this.gainpainMessage="Add more gains or reduce pains to derive a greater Gain-Pain Ratio (GPR)!"
    }
    if(this.GainVal/this.PainVal <= 6 && this.GainVal / this.PainVal >= 4)
    {
      this.gainpainMessage="Good work! but the solution still needs to be worked on. Add more gains or reduce pains to derive a greater Gain-Pain Ratio (GPR)."
    }
    if( this.GainVal/this.PainVal >= 6 && this.GainVal / this.PainVal <= 10)
    {
      this.gainpainMessage="Excellent! Your Gain-Pain Ratio (GPR) is increasing steadily, but it needs to add more value / lower the barrier of entry for users or customers. Add more gains or reduce pains to derive a greater Gain-Pain Ratio (GPR)."
    }
    if( this.GainVal / this.PainVal >= 10 && this.GainVal / this.PainVal !== Infinity)
    {this.gainpainMessage="You are good to go! Check out your competitors in the competitor updates page."}
    if( this.GainVal/this.PainVal == Infinity || this.GainVal/this.PainVal == 0 )
    {
      this.gainpainMessage="Insufficient Datasets."
    }
    if(this.GainVal/this.PainVal == 0){
      this.gainpainMessage="No data to evaluate. Start inputing data."
    }

    if(this.ratioAnalysis <= 3 && this.ratioAnalysis >= 0)
    {
      this.analysisMessage="Add more gains or reduce pains to derive a greater Gain-Pain Ratio (GPR)!"
    }
    if(this.ratioAnalysis <= 6 && this.ratioAnalysis >= 4)
    {
      this.analysisMessage="Good work! but the solution still needs to be worked on. Add more gains or reduce pains to derive a greater Gain-Pain Ratio (GPR)."
    }
    if( this.ratioAnalysis >= 6 && this.ratioAnalysis <= 10)
    {
      this.analysisMessage="Excellent! Your Gain-Pain Ratio (GPR) is increasing steadily, but it needs to add more value / lower the barrier of entry for users or customers. Add more gains or reduce pains to derive a greater Gain-Pain Ratio (GPR)."
    }
    if( this.ratioAnalysis >= 10 && this.ratioAnalysis !== Infinity)
    {this.analysisMessage="You are good to go! Check out your competitors in the competitor updates page."}
    if( this.ratioAnalysis == Infinity || this.ratioAnalysis == 0 )
    {
      this.analysisMessage="Insufficient Datasets."
    }
    if(this.ratioAnalysis == 0){
      this.analysisMessage="No data to evaluate. Start inputing data."
    }
  }



}
