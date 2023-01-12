import {
  Controller,
  Res,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiTags } from '@nestjs/swagger';
import { LoadRankingDto } from './dto';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(
    private rankingService: RankingService
  ) { }

  @Post()
  public async loadRanking(
    @Res() res,
    @Body() loadRankingDto: LoadRankingDto,
  ) {
    const ranking = await this.rankingService.load(loadRankingDto.days);
    return res.status(HttpStatus.OK).json(ranking);
  }
}
