import {Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    getDefault(): unknown {
        return {};
    }
}
