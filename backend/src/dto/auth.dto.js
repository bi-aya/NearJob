const { IsEmail, IsString, MinLength, IsEnum } = require('class-validator');

class RegisterDto {
  @IsEmail({}, { message: "Email invalide" }) email;
  @IsString() @MinLength(6, { message: "Mot de passe trop court" }) password;
  @IsEnum(['freelance', 'recruiter']) role;
}

class LoginDto {
  @IsEmail({}, { message: "Email invalide" }) email;
  @IsString() password;
}

module.exports = { RegisterDto, LoginDto };