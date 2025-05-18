import { IsArray, IsEnum } from 'class-validator';

import { Coordinate } from '../types/coordinate.type';


export class Polygon {
    @IsEnum(['Polygon'])
    type = 'Polygon' as const;

    @IsArray()
    coordinates: Coordinate[][];
}
