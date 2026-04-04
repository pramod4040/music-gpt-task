import { IsString, IsOptional, IsInt, Min, Max, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query (matches email/display_name for users, title for audio)' })
  @IsString()
  @MinLength(1)
  q: string;

  @ApiPropertyOptional({ description: 'Max results per entity type', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Cursor for users pagination (base64 encoded)' })
  @IsOptional()
  @IsString()
  user_cursor?: string;

  @ApiPropertyOptional({ description: 'Cursor for audio pagination (base64 encoded)' })
  @IsOptional()
  @IsString()
  audio_cursor?: string;
}

export interface SearchCursor {
  score: number;
  id: string;
}

export interface UserSearchResult {
  id: string;
  email: string;
  display_name: string;
  subscription_status: string;
  created_at: Date;
  score: number;
}

export interface AudioSearchResult {
  id: string;
  title: string;
  url: string;
  user_id: string;
  prompt_id: string;
  created_at: Date;
  score: number;
}

export interface SearchMeta {
  next_cursor: string | null;
}

export interface SearchEntityResult<T> {
  data: T[];
  meta: SearchMeta;
}

export interface SearchResponseDto {
  users: SearchEntityResult<UserSearchResult>;
  audio: SearchEntityResult<AudioSearchResult>;
}
