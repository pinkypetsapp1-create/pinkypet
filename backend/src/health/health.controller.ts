import { Controller, Get, Res } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Connection } from 'mongoose';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly db: Connection) {}

  /** Lo usa Render para saber si el servicio está vivo. 503 si no hay base de datos. */
  @Get()
  async health(@Res() res: Response): Promise<void> {
    let db = false;
    try {
      db = this.db.readyState === 1 && (await this.db.db!.admin().ping()).ok === 1;
    } catch {
      db = false;
    }
    res.status(db ? 200 : 503).json({ status: db ? 'ok' : 'error', db: db ? 'up' : 'down' });
  }
}
