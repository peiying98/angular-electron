import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NotesService} from '../../../service/notes/notes.service';
import * as $ from 'jquery'
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notesForm: FormGroup;
  @Input() CanvasID: any;
  notesCol: any;
  mobile:boolean;
  constructor(
    public fb: FormBuilder,
    private notesService: NotesService,) { }

  ngOnInit() {
    if($(window).width() <= 800)
    {this.mobile = true;}
    else{
      this.mobile= false;
    }
    this.notesCol = this.notesService.getNotes(this.CanvasID);

    this.notesForm = this.fb.group({'notes': ['', []]});

  }
  get notes() { return this.notesForm.get('notes') }


addNotes(){
this.notesService.addNote(this.CanvasID, {
 content: this.notes.value,
 timeStamp: Date.now()
})
$('input[name="addNotesInput"]').val('')
}


showDel(note){ 
  $(`#${note.ID}trashBtn`).slideUp(()=>{
    $(`#${note.ID}delDiv`).slideDown();
  });
}
deleteNote(note){ 
  this.notesService.deleteNotes(this.CanvasID, note.ID);
}
hideDel(note) {
  $(`#${note.ID}delDiv`).slideUp(()=>{
    $(`#${note.ID}trashBtn`).slideDown();
  });
  
  
}

}
