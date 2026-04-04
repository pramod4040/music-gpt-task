import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma.service';
import {
  SearchQueryDto,
  SearchCursor,
  UserSearchResult,
  AudioSearchResult,
  SearchEntityResult,
  SearchResponseDto,
} from './dto/search.dto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SCORES = new Set([1, 2, 3]);

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchQueryDto): Promise<SearchResponseDto> {
    const { q, limit = 10 } = query;

    const userCursor = this.decodeCursor(query.user_cursor);
    const audioCursor = this.decodeCursor(query.audio_cursor);

    const [users, audio] = await Promise.all([
      this.searchUsers(q, limit, userCursor),
      this.searchAudio(q, limit, audioCursor),
    ]);

    return { users, audio };
  }

  /**
   * Ranking tiers (score):
   *   3 — exact match  (field lowercased == query lowercased)
   *   2 — prefix match (field starts with query)
   *   1 — contains match
   *
   * Cursor keyset ordering: (score DESC, id ASC)
   * Next page condition: score < S  OR  (score = S AND id > I)
   */
  private async searchUsers(
    q: string,
    limit: number,
    cursor: SearchCursor | null,
  ): Promise<SearchEntityResult<UserSearchResult>> {
    const term = q.toLowerCase();

    type RawRow = UserSearchResult & { score: bigint };

    let rows: RawRow[];

    if (cursor) {
      rows = await this.prisma.$queryRaw<RawRow[]>`
        SELECT
          u.id,
          u.email,
          u.display_name,
          u.subscription_status::text AS subscription_status,
          u.created_at,
          CASE
            WHEN LOWER(u.email) = ${term} OR LOWER(u.display_name) = ${term} THEN 3
            WHEN LOWER(u.email) LIKE ${term + '%'} OR LOWER(u.display_name) LIKE ${term + '%'} THEN 2
            ELSE 1
          END AS score
        FROM "User" u
        WHERE (
          LOWER(u.email) LIKE ${'%' + term + '%'}
          OR LOWER(u.display_name) LIKE ${'%' + term + '%'}
        )
        AND (
          CASE
            WHEN LOWER(u.email) = ${term} OR LOWER(u.display_name) = ${term} THEN 3
            WHEN LOWER(u.email) LIKE ${term + '%'} OR LOWER(u.display_name) LIKE ${term + '%'} THEN 2
            ELSE 1
          END < ${cursor.score}
          OR (
            CASE
              WHEN LOWER(u.email) = ${term} OR LOWER(u.display_name) = ${term} THEN 3
              WHEN LOWER(u.email) LIKE ${term + '%'} OR LOWER(u.display_name) LIKE ${term + '%'} THEN 2
              ELSE 1
            END = ${cursor.score}
            AND u.id > ${cursor.id}
          )
        )
        ORDER BY score DESC, u.id ASC
        LIMIT ${limit + 1}
      `;
    } else {
      rows = await this.prisma.$queryRaw<RawRow[]>`
        SELECT
          u.id,
          u.email,
          u.display_name,
          u.subscription_status::text AS subscription_status,
          u.created_at,
          CASE
            WHEN LOWER(u.email) = ${term} OR LOWER(u.display_name) = ${term} THEN 3
            WHEN LOWER(u.email) LIKE ${term + '%'} OR LOWER(u.display_name) LIKE ${term + '%'} THEN 2
            ELSE 1
          END AS score
        FROM "User" u
        WHERE (
          LOWER(u.email) LIKE ${'%' + term + '%'}
          OR LOWER(u.display_name) LIKE ${'%' + term + '%'}
        )
        ORDER BY score DESC, u.id ASC
        LIMIT ${limit + 1}
      `;
    }

    return this.buildResult<UserSearchResult>(rows, limit);
  }

  private async searchAudio(
    q: string,
    limit: number,
    cursor: SearchCursor | null,
  ): Promise<SearchEntityResult<AudioSearchResult>> {
    const term = q.toLowerCase();

    type RawRow = AudioSearchResult & { score: bigint };

    let rows: RawRow[];

    if (cursor) {
      rows = await this.prisma.$queryRaw<RawRow[]>`
        SELECT
          a.id,
          a.title,
          a.url,
          a.user_id,
          a.prompt_id,
          a.created_at,
          CASE
            WHEN LOWER(a.title) = ${term} THEN 3
            WHEN LOWER(a.title) LIKE ${term + '%'} THEN 2
            ELSE 1
          END AS score
        FROM "Audio" a
        WHERE LOWER(a.title) LIKE ${'%' + term + '%'}
        AND (
          CASE
            WHEN LOWER(a.title) = ${term} THEN 3
            WHEN LOWER(a.title) LIKE ${term + '%'} THEN 2
            ELSE 1
          END < ${cursor.score}
          OR (
            CASE
              WHEN LOWER(a.title) = ${term} THEN 3
              WHEN LOWER(a.title) LIKE ${term + '%'} THEN 2
              ELSE 1
            END = ${cursor.score}
            AND a.id > ${cursor.id}
          )
        )
        ORDER BY score DESC, a.id ASC
        LIMIT ${limit + 1}
      `;
    } else {
      rows = await this.prisma.$queryRaw<RawRow[]>`
        SELECT
          a.id,
          a.title,
          a.url,
          a.user_id,
          a.prompt_id,
          a.created_at,
          CASE
            WHEN LOWER(a.title) = ${term} THEN 3
            WHEN LOWER(a.title) LIKE ${term + '%'} THEN 2
            ELSE 1
          END AS score
        FROM "Audio" a
        WHERE LOWER(a.title) LIKE ${'%' + term + '%'}
        ORDER BY score DESC, a.id ASC
        LIMIT ${limit + 1}
      `;
    }

    return this.buildResult<AudioSearchResult>(rows, limit);
  }

  private buildResult<T extends { id: string; score: bigint | number }>(
    rows: T[],
    limit: number,
  ): SearchEntityResult<Omit<T, never>> {
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit).map((r) => ({
      ...r,
      score: Number(r.score),
    })) as (T & { score: number })[];

    const nextCursor =
      hasMore && data.length > 0
        ? this.encodeCursor({ score: data[data.length - 1].score, id: data[data.length - 1].id })
        : null;

    return { data, meta: { next_cursor: nextCursor } };
  }

  private encodeCursor(cursor: SearchCursor): string {
    return Buffer.from(JSON.stringify(cursor)).toString('base64url');
  }

  private decodeCursor(encoded?: string): SearchCursor | null {
    if (!encoded) return null;

    let parsed: unknown;
    try {
      const decoded = Buffer.from(encoded, 'base64url').toString('utf-8');
      parsed = JSON.parse(decoded);
    } catch {
      throw new BadRequestException('Invalid cursor: malformed base64 or JSON');
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as SearchCursor).score !== 'number' ||
      typeof (parsed as SearchCursor).id !== 'string'
    ) {
      throw new BadRequestException('Invalid cursor: unexpected shape');
    }

    const cursor = parsed as SearchCursor;

    if (!VALID_SCORES.has(cursor.score)) {
      throw new BadRequestException('Invalid cursor: score out of range');
    }

    if (!UUID_REGEX.test(cursor.id)) {
      throw new BadRequestException('Invalid cursor: id is not a valid UUID');
    }

    return cursor;
  }
}
