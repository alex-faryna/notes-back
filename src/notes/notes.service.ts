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
        /*this.createNote({
            title: "bruh FINALLY",
            content: "44433322222!!!!!"
        });*/
        // this.getAllNotes().then(console.log);

        /*const e = this.notesRepository.createQueryBuilder("note")
            .insert()
            .values({
              title: "New 6",
              content: "Content 2",
              prev: () => `(SELECT id FROM note_entity WHERE nextId IS NULL)`,
            }).getQuery();
        console.log(e);*/

        /*this.createNote({
          title: "New WOWWW",
          content: "First auto"
        }).then(console.log);*/

        // this.notesRepository.query(NotesService.getNotesQuery()).then(console.log);

        // this.notesRepository.manager.
// whyyy bro

        /*
        this.notesRepository.manager.query(NotesService.createNoteQuery({
          title: "Test"
        })).then(console.log);*/


        /*this.notesRepository.createQueryBuilder("note")
            .insert()
            .values({
              title: "New 6",
              content: "Content 2",
              prev: () => `(SELECT id FROM note_entity WHERE nextId IS NULL)`,
            }).execute().then(console.log);*/


        /*this.notesRepository
            .createQueryBuilder("note")
            .select("note.id")
            .orderBy("note.prevId", "DESC")
            .execute().then(console.log);*/
        // this.notesRepository.query(t).then(console.log);

        //this.createNote();


        //for(let i = 0;i < 4;i ++) {
        // this.notesRepository.query(NEW_QUERY).then(console.log);
        // }
        /*
        INSERT INTO Customers (name, age)
    SELECT 'MM', 20 WHERE (SELECT count(*) from Customers) < 10;
         */

        // console.log(divideBy2("0.0005"));

        /*setTimeout(() => {
          const num1 = "0";
          const num2 = "1";
          let num3 = num2;
          for (let i = 0;i < 100;i++) {
            num3 = divideBy2(sum(num1, num3));
            console.log(`${i}: ${num3}`);
          }
        }, 100);*/
        /*const num1 = new Big("1");
        const num2 = new Big("2");
        let num3 = new Big(num1);
        console.log(num1.toString());
        console.log(num2.toString());
        let i = 0;
        for (let i = 0;i < 1000;i++) {
          num3 = num3.plus(num2).div(2)
          console.log(`${i}: ${num3.toString()}`);
          i++;
        }*/

        // this.notesRepository.find().then(console.log);
        /*this.notesRepository.save({
          id: 27,
          title: "TRY THIS PLZ",
          content:" Wait",
        }).then(console.log);*/
    }

    // unlikely bug: if there are notes with same modified timestamp then may be some duplicated in the frontend
    // can be mitigated actually by removing the dups which are aready in the frontend
    async getNotes(start: string, take: number): Promise<Array<NoteEntity>> {
        return this.notesRepository.find();
        /*const id = 24;
        return this.notesRepository.find({
          order: {
            order: "desc",
          },
          where: {
            updated: LessThan(new Date(start)),
            id: Not(id),
          },
          take,
        });*/
    }

    // fix when all nots are loaded and trying to lod more then it sends -1 from the frontend which not correct
    async getNotesByIdDate(id: number, take: number): Promise<Array<NoteEntity>> {
        const d = this.notesRepository
            .createQueryBuilder("start")
            .orderBy("start.updated", "DESC")
            .select("start.updated");
        const query = (id > 0
            ? d.where("id = :id", {id})
            : d).take(1).getQuery();
        return this.notesRepository
            .createQueryBuilder("note")
            .orderBy("note.updated", "DESC")
            .where(`note.updated <${id > 0 ? '' : '='} (${query})`)
            .setParameters(d.getParameters())
            .take(take)
            .getMany();
    }

    async getAllNotes(): Promise<Array<NoteEntity>> {
        return this.notesRepository.query(NotesService.getNotesQuery());
    }

    async getNoteById(id: number): Promise<NoteEntity> {
        return this.notesRepository.findOneBy({id});
    }

    async bulkCreate(notes: Array<Partial<NoteEntity>>): Promise<Array<NoteEntity>> {
        return this.notesRepository.save(notes);
    }

    // same as bulkCreate i guess?
    async bulkEdit(): Promise<NoteEntity> {
        return null;
    }

    async bulkDelete(notes: Array<number>): Promise<unknown> {
        return this.notesRepository.delete({id: In(notes)});
    }

    private async createNote(note: Partial<NoteEntity>): Promise<unknown> {
        return this.notesRepository.manager.transaction(async mm => {
            const count = await mm.findOne(NoteEntity, {
                where: {
                    id: MoreThan(0),
                }
            });
            const {raw} = await mm.insert(NoteEntity, {
                ...note,
                prev: () => `(SELECT id FROM note_entity WHERE nextId IS NULL)`,
            });
            if (!count) {
                return;
            }
            await this.notesRepository.createQueryBuilder("note")
                .update(NoteEntity)
                .set({
                    next: raw,
                })
                .where("id != :id", {id: raw})
                .andWhere("nextId IS NULL")
                .execute();
        })
    }

    // prolly remove
    private static createNoteQuery(note: Partial<NoteEntity>): string {
        return `insert into note_entity("title", "content", "prevId")
                values ('${note.title}', '${note.content}', (SELECT id FROM note_entity WHERE nextId IS NULL))`
    }

    private static getNotesQuery(id: number | false = false, count: number | false = false): string {
        const root = id ? `id = ${id}` : `nextId IS NULL`;
        const limit = count ? `limit ${count}` : ``;
        console.log(limit);
        return `with recursive cte_notes as (select *
                                             from note_entity
                                             where ${root}
                                             union all
                                             select l.id, l.title, l.content, l.prevId, l.nextId
                                             from note_entity l
                                                      join cte_notes c on c.prevId = l.id
                    ${limit}
                    )
        select *
        from cte_notes`;
    }
}
