import {Body, Controller, Delete, Get, Param, Put, Query} from '@nestjs/common';
import { NotesService } from './notes.service';
import {NoteEntity} from "./note.entity";
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('all')
  async getAllNotes(): Promise<Array<NoteEntity>> {
    return await this.notesService.getAllNotes();
  }

  @Get('from')
  async getNotesByIdDate(@Query('start') id = -1, @Query('count') count = 5): Promise<Array<NoteEntity>> {
    return await this.notesService.getNotesByIdDate(id, count);
  }

  @Get()
  async getNotes(@Query('start') start = "", @Query('count') count = 5): Promise<Array<NoteEntity>> {
    return await this.notesService.getNotes(start, count);
  }

  @Get(':id')
  async getNoteById(@Param('id') id): Promise<NoteEntity> {
    return await this.notesService.getNoteById(id);
  }

  @Put()
  async saveNotes(@Body() body): Promise<Array<NoteEntity>> {
    console.log(body);
    return null; // await this.notesService.bulkCreate()
  }

  // save notes i guss is the same as save and edit
  @Put()
  async updateNotes(@Body() body): Promise<Array<NoteEntity>> {
    console.log(body);
    return null; // await this.notesService.bulkUpdate()
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
