/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
    ApplySchemaOptions,
    DefaultSchemaOptions,
    Document,
    FlatRecord,
    HydratedDocument,
    Model,
    ObtainDocumentType,
    ResolveSchemaOptions,
    Schema,
    SchemaDefinition,
    SchemaDefinitionType,
    SchemaOptions
} from 'mongoose';


type TransformMethods = 'toObject' | 'toJSON';

export function schemaTransformsForVirtualID<TClass = any>(
    schema: Schema<TClass>,
    toJSONOptions?: SchemaOptions['toJSON'],
    toObjectOptions?: SchemaOptions['toObject'],
    removeVersion = true
): Schema<TClass> {
    const transformOptions: Array<
        [ TransformMethods, SchemaOptions[TransformMethods] ]
    > = [
        [ 'toObject', toObjectOptions || {} ],
        [ 'toJSON',  toJSONOptions || {} ],
    ];

    Object.defineProperty(schema, '__hasVirtualID__', {
        value: true,
        writable: false,
        enumerable: false
    });

    for (const [key, options] of transformOptions)
        schema.set(
            key,
            Object.assign({}, options, {
                virtuals: true,
                transform: (doc: any, ret: any, opt: any) => {
                    if (typeof options?.transform === 'function')
                        options?.transform(doc, ret, opt);

                    delete ret._id;

                    if (removeVersion)
                        delete ret.__v;
                },
            })
        );

    return schema;
}

/** @ignore */
function virtualIdOptions(options: any) {
    const opts = options || {};

    if (!opts.virtuals)
        opts.virtuals = {};

    if (!opts.virtuals.id)
        opts.virtuals.id = {};

    Object.assign(opts.virtuals.id, {
        get: function (this: Document<string>) {
            return this._id.toString();
        },
        set: function (this: Document<string>, value: string) {
            this._id = value;
        },
    });
}


/**
 * Mongoose Schema with a virtual `id` property
 * combine with `schemaTransformsForVirtualID`
 * to remove `_id` and `__v` properties.
 *
 * @see {@link schemaTransformsForVirtualID}
 */
export class SchemaWithVirtualID<
    RawDocType = any,
    TModelType = Model<RawDocType, any, any, any>,
    TInstanceMethods = {},
    TQueryHelpers = {},
    TVirtuals = {},
    TStaticMethods = {},
    TSchemaOptions = DefaultSchemaOptions,
    DocType extends ApplySchemaOptions<
        ObtainDocumentType<DocType, RawDocType, ResolveSchemaOptions<TSchemaOptions>>,
        ResolveSchemaOptions<TSchemaOptions>
    > = ApplySchemaOptions<
        ObtainDocumentType<any, RawDocType, ResolveSchemaOptions<TSchemaOptions>>,
        ResolveSchemaOptions<TSchemaOptions>
    >,
    THydratedDocumentType = HydratedDocument<FlatRecord<DocType>, TVirtuals & TInstanceMethods, {}, TVirtuals>
> extends Schema<
    RawDocType,
    TModelType,
    TInstanceMethods,
    TQueryHelpers,
    TVirtuals & { id: string },
    TStaticMethods,
    TSchemaOptions,
    DocType,
    THydratedDocumentType
> {
    constructor(
        definition?: SchemaDefinition<SchemaDefinitionType<RawDocType>, RawDocType, THydratedDocumentType> | DocType,
        options?: SchemaOptions<FlatRecord<DocType>, TInstanceMethods, TQueryHelpers, TStaticMethods, TVirtuals, THydratedDocumentType>
    ) {
        super(definition, virtualIdOptions(options) as any);
    }
}