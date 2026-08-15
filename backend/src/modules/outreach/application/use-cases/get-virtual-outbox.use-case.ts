import { Inject, Injectable } from '@nestjs/common';
import { IVirtualOutboxPort, VIRTUAL_OUTBOX_PORT_TOKEN, VirtualOutboxRecord } from '../../domain/ports/virtual-outbox.port';

@Injectable()
export class GetVirtualOutboxUseCase {
  constructor(
    @Inject(VIRTUAL_OUTBOX_PORT_TOKEN)
    private readonly virtualOutbox: IVirtualOutboxPort,
  ) {}

  async execute(): Promise<VirtualOutboxRecord[]> {
    return this.virtualOutbox.getAllSentRecords();
  }
}
