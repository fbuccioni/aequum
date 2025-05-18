import { IsArray, IsEnum } from 'class-validator';

import { Coordinate } from '../types/coordinate.type';


export class MultiPolygon {
    @IsEnum(['MultiPolygon'])
    type = 'MultiPolygon' as const;

    @IsArray()
    coordinates: Coordinate[][][];
}
