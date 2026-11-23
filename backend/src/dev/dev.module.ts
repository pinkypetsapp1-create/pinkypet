import { Module } from '@nestjs/common';
import { AdoptionRequestsModule } from '../adoption-requests/adoption-requests.module';
import { DevController } from './dev.controller';

@Module({ imports: [AdoptionRequestsModule], controllers: [DevController] })
export class DevModule {}
