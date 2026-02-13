import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetStatsQueryDto {
  @ApiProperty({ required: false, example: '2026-02-12' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (ISO 8601)' })
  date?: string;
}