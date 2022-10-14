import { Controller, Get, Request, Post, UseGuards, Body, Param, BadRequestException } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../../src/modules/auth/jwt-auth.guard';
import { AppAuthenticationDto, AppAuthSflowDto } from '@dto/app-authentication.dto';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '@dto/user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post(['authenticate', 'authenticate/:organizationId'])
  async login(@Body() appAuthDto: AppAuthenticationDto, @Param('organizationId') organizationId) {
    return this.authService.login(appAuthDto.email, appAuthDto.password, organizationId);
  }

  @Post(['sflowauth'])
  async sflowauth(@Body() appAuthDto: AppAuthSflowDto) {
    return this.authService.sflowauth(appAuthDto.userId, appAuthDto.apiKey);
  }

  @UseGuards(JwtAuthGuard)
  @Get('switch/:organizationId')
  async switch(@Param('organizationId') organizationId, @User() user) {
    if (!organizationId) {
      throw new BadRequestException();
    }
    return await this.authService.switchOrganization(organizationId, user);
  }

  @Post('createuser')
  async create(@Body() userCreateDto: CreateUserDto) {
    return await this.authService.setupAccountBySflow(userCreateDto);
  }
  /*
  @Post('set-password-from-token')
  async create(@Body() userCreateDto: CreateUserDto) {
    await this.authService.setupAccountFromInvitationToken(userCreateDto);
    return {};
  }

  @Post('accept-invite')
  async acceptInvite(@Body() acceptInviteDto: AcceptInviteDto) {
    await this.authService.acceptOrganizationInvite(acceptInviteDto);
    return {};
  }

  @UseGuards(SignupDisableGuard)
  @Post('signup')
  async signup(@Body() appAuthDto: AppAuthenticationDto) {
    return this.authService.signup(appAuthDto.email);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() appAuthDto: AppForgotPasswordDto) {
    await this.authService.forgotPassword(appAuthDto.email);
    return {};
  }

  @Post('/reset-password')
  async resetPassword(@Body() appAuthDto: AppPasswordResetDto) {
    const { token, password } = appAuthDto;
    await this.authService.resetPassword(token, password);
    return {};
  }
  */

  @Get(['/health', '/api/health'])
  async healthCheck(@Request() req) {
    return { works: 'yeah' };
  }

  @Get('/')
  async rootPage(@Request() req) {
    return { message: 'Instance seems healthy but this is probably not the right URL to access.' };
  }
}
