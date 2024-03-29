import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { NotesService } from './notes.service';
import {NoteEntity} from "./note.entity";
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('all')
  async getAllNotes(): Promise<Array<NoteEntity>> {
    return await this.notesService.getAllNotes();
  }

  @Get()
  async getNotes(@Query('start') start: number | false = false, @Query('count') count = 5): Promise<Array<NoteEntity>> {

    const res = await this.notesService.getNotes((start as unknown) === "false" ? false : start, count);
    return (start as unknown) === "false" ? res : res.slice(1);
  }

  @Get(':id')
  async getNoteById(@Param('id') id): Promise<NoteEntity> {
    return await this.notesService.getNoteById(id);
  }

  @Put()
  async saveNotes(@Body() body: {color: string}): Promise<number> {
    return await this.notesService.createNote({
      title: "New note",
      content: "New content",
      color: body.color,
    });
  }

  // save notes i guss is the same as save and edit
  @Post()
  async updateNote(@Body() body: {note: NoteEntity}): Promise<NoteEntity> {
    return await this.notesService.updateNote(body.note);
  }

  @Delete()
  async deleteNotes(@Body() body): Promise<Array<NoteEntity>> {
    console.log(body);
    return null; // await this.notesService.bulkDelete()
  }




  // why not se bulk for each action ? under the hood yes, maybe for single stuff we can

  // just create the buklk object here and that's all

  // also i think maybe combine these two and share some stuff??
}
