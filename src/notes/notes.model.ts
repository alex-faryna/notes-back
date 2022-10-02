export interface NotesBulkAction {
    create: unknown[], // notes with id's, generate new one's and send back along with a rules table or what
    edit: unknown[], // notes
    delete: number[] // id's
}