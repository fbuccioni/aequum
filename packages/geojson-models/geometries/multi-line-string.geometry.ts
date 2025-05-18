import { IsArray, IsEnum } from 'class-validator';

import { Coordinate } from '../types/coordinate.type';


export class MultiLineString {
    @IsEnum(['MultiLineString'])
    type = 'MultiLineString' as const;

    @IsArray()
    coordinates: Array<Coordinate[]>;
}
