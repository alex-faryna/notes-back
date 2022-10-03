import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class NoteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({
        nullable: true,
        unique: false,
    })
    last: number;

    @Column()
    color: string;

    @OneToOne(() => NoteEntity, note => note.id)
    @JoinColumn()
    prev: number;

    creationId?: number;
}