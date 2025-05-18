import { IsEnum } from 'class-validator';

import { IsCoordinate } from '../validators/is-coordinate.validator';
import { Coordinate } from '../types/coordinate.type';


export class Point {
    @IsEnum(['Point'])
    type = 'Point' as const;

    @IsCoordinate()
    coordinates: Coordinate;
}

