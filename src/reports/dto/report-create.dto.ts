import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsObject,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator'

export class CreateReportDto {
  @Min(0)
  @Max(1000000)
  @IsNumber()
  price: number

  @IsString()
  make: string

  @IsString()
  model: string

  @IsNumber()
  @Min(1950)
  @Max(2030)
  year: number

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number

  @IsLongitude()
  lng: number

  @IsLatitude()
  lat: number
}
