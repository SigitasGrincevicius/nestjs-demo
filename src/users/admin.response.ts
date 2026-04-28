import { Expose } from 'class-transformer';

export class AdminResponse {
  constructor(private readonly partial?: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }

  @Expose()
  message!: string;
}
