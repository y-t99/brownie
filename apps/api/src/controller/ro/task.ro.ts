import { IsIn, IsNotEmpty, IsString } from "class-validator";

const VALID_ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'] as const;
const VALID_RESOLUTIONS = ['1K', '2K', '4K'] as const;

export class T2MNanoBananaProRo {

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_ASPECT_RATIOS, { message: `aspect_ratio must be one of: ${VALID_ASPECT_RATIOS.join(', ')}` })
  aspect_ratio: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_RESOLUTIONS, { message: `resolution must be one of: ${VALID_RESOLUTIONS.join(', ')}` })
  resolution: string;
}