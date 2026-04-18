const { IsString, IsNotEmpty, IsOptional } = require('class-validator');

class CreateExperienceDto {
  @IsString() @IsNotEmpty({ message: "Le titre est requis" }) title;
  @IsString() @IsNotEmpty({ message: "L'entreprise est requise" }) company;
  @IsString() startDate;
  @IsOptional() @IsString() endDate;
}

module.exports = { CreateExperienceDto };