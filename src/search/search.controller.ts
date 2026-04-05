import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchResponseDto, ErrorMessage } from './dto/search.dto';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({
    summary: 'Unified search across users and audio',
    description:
      'Searches users (email, display_name) and audio (title) with scoring: exact=3, prefix=2, contains=1. Returns cursor-based paginated results for each entity type independently.',
  })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiQuery({ name: 'limit', description: 'Results per entity (1-50)', required: false })
  @ApiQuery({ name: 'user_cursor', description: 'Cursor for next page of users', required: false })
  @ApiQuery({ name: 'audio_cursor', description: 'Cursor for next page of audio', required: false })
  @ApiResponse({
    status: 200,
    description: 'Search results with ranking scores and next_cursor per entity',
  })
  async search(@Query() query: SearchQueryDto): Promise<SearchResponseDto | ErrorMessage> {
    try {
      return this.searchService.search(query);
    } catch (error) {
      return { status: "error", message: error.message }
    }
  }
}
