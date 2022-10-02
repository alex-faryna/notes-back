import {Module} from '@nestjs/common';
import {NotesModule} from './notes/notes.module';
import {AppController} from "./app.controller";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "data/db.sqlite",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true
        }),
        NotesModule
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
