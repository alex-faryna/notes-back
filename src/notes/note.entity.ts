import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class NoteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @OneToOne(() => NoteEntity, note => note.id)
    @JoinColumn()
    prev: number;

    @OneToOne(() => NoteEntity, note => note.id)
    @JoinColumn()
    next: number;

    creationId?: number;
}