import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {NoteEntity} from "./note.entity";
import {In, MoreThan, Repository} from "typeorm";

// separate, we cannot do all these acitons at once
// and dont need to  actually
// separate into create edit and delete bulk actions
export interface NoteBulkActions {
    create: Array<NoteEntity>, // with creationId
    edit: Array<NoteEntity>,
    delete: Array<number>
}

@Injectable()
export class NotesService {
    constructor(@InjectRepository(NoteEntity)
                private notesRepository: Repository<NoteEntity>) {
    }

    async getNoteById(id: number): Promise<NoteEntity> {

        this.createNote({
            title: "" + id,
            content: "" + id,
        }).then(console.log);

        return this.notesRepository.findOneBy({id});
    }

    async bulkDelete(notes: Array<number>): Promise<unknown> {
        return this.notesRepository.delete({id: In(notes)});
    }

    async getNotes(start: number | false = false, take: number) {
        console.log(start);
        console.log(typeof start);
        return this.notesRepository.query(NotesService.getNotesQuery(start, take));
    }

    async getAllNotes(): Promise<Array<NoteEntity>> {
        return this.notesRepository.query(NotesService.getNotesQuery());
    }

    // perfect
    async createNote(note: Partial<NoteEntity>): Promise<number> {
        let res = 0;
        await this.notesRepository.manager.transaction(async mm => {
            const count = await mm.findOne(NoteEntity, {
                where: {
                    id: MoreThan(0),
                }
            });
            const {raw} = await mm.insert(NoteEntity, {
                ...note,
                prev: () => `(SELECT id FROM note_entity WHERE last = 1)`,
                last: 1,
            });
            res = raw;
            if (!count) {
                return;
            }
            await this.notesRepository.createQueryBuilder("note")
                .update(NoteEntity)
                .set({
                    last: 0,
                })
                .where("id != :id", {id: raw})
                .andWhere("last = true")
                .execute();
        })
        return res;
    }

    async updateNote(note: NoteEntity): Promise<NoteEntity> {
        return this.notesRepository.save(note);
    }

    private static getNotesQuery(id: number | false = false, count: number | false = false): string {
        const root = id ? `id = ${id}` : `last = 1`;
        const limit = count ? `limit ${count}` : ``;
        return `with recursive cte_notes as 
            (select * from note_entity
            where ${root}
            union all
            select l.id, l.title, l.content, l.last, l.color, l.prevId
            from note_entity l
            join cte_notes c on c.prevId = l.id 
            ${limit}
            )
        select * from cte_notes`;
    }
}
