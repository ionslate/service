import { AppContext } from './utils';
import { GraphQLResolveInfo } from 'graphql';
import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { AmmoEntity } from '@content-manager/ammo/entities/AmmoEntity';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ammo = {
  __typename?: 'Ammo';
  id: Scalars['ID'];
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  combinedAmmo: Array<Ammo>;
};

export type AmmoRequest = {
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  combinedAmmoIds: Array<Scalars['ID']>;
};

export type HackingDevice = {
  __typename?: 'HackingDevice';
  id: Scalars['ID'];
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  programs: Array<HackingProgram>;
  validationErrors?: Maybe<Array<ValidationError>>;
};

export type HackingDeviceRequest = {
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  programIds: Array<Scalars['ID']>;
};

export type HackingProgram = {
  __typename?: 'HackingProgram';
  id: Scalars['ID'];
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  attackMod?: Maybe<Scalars['String']>;
  opponentMod?: Maybe<Scalars['String']>;
  damage?: Maybe<Scalars['String']>;
  burst?: Maybe<Scalars['String']>;
  target: Array<HackingProgramTarget>;
  skillType: Array<HackingProgramSkillType>;
  special?: Maybe<Scalars['String']>;
};

export type HackingProgramRequest = {
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  attackMod?: Maybe<Scalars['String']>;
  opponentMod?: Maybe<Scalars['String']>;
  damage?: Maybe<Scalars['String']>;
  burst?: Maybe<Scalars['String']>;
  target: Array<HackingProgramTarget>;
  skillType: Array<HackingProgramSkillType>;
  special?: Maybe<Scalars['String']>;
};

export type HackingProgramSkillType =
  | 'ENTIRE_ORDER'
  | 'SHORT_SKILL'
  | 'ARO';

export type HackingProgramTarget =
  | 'REM'
  | 'TAG'
  | 'HI'
  | 'HACKER';

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['Int']>;
  addProgramToHackingDevice: HackingDevice;
  createAmmo: Ammo;
  createHackingDevice: HackingDevice;
  createHackingProgram: HackingProgram;
  createRule: Rule;
  removeProgramFromHackingDevice?: Maybe<Scalars['ID']>;
  updateAmmo: Ammo;
  updateHackingDevice: HackingDevice;
  updateHackingProgram: HackingProgram;
  updateRule: Rule;
};


export type MutationAddProgramToHackingDeviceArgs = {
  hackingDeviceId: Scalars['ID'];
  hackingProgramId: Scalars['ID'];
};


export type MutationCreateAmmoArgs = {
  request: AmmoRequest;
};


export type MutationCreateHackingDeviceArgs = {
  request: HackingDeviceRequest;
};


export type MutationCreateHackingProgramArgs = {
  request: HackingProgramRequest;
};


export type MutationCreateRuleArgs = {
  request: RuleRequest;
};


export type MutationRemoveProgramFromHackingDeviceArgs = {
  hackingDeviceId: Scalars['ID'];
  hackingProgramId: Scalars['ID'];
};


export type MutationUpdateAmmoArgs = {
  ammoId: Scalars['ID'];
  request: AmmoRequest;
};


export type MutationUpdateHackingDeviceArgs = {
  hackingDeviceId: Scalars['ID'];
  request: HackingDeviceRequest;
};


export type MutationUpdateHackingProgramArgs = {
  hackingProgramId: Scalars['ID'];
  request?: Maybe<HackingProgramRequest>;
};


export type MutationUpdateRuleArgs = {
  ruleId: Scalars['ID'];
  request: RuleRequest;
};

export type PagedAmmo = {
  __typename?: 'PagedAmmo';
  content: Array<Ammo>;
  limit?: Maybe<Scalars['Int']>;
  count: Scalars['Int'];
  page: Scalars['Int'];
  last: Scalars['Boolean'];
};

export type PagedHackingDevices = {
  __typename?: 'PagedHackingDevices';
  content: Array<HackingDevice>;
  limit?: Maybe<Scalars['Int']>;
  count: Scalars['Int'];
  page: Scalars['Int'];
  last: Scalars['Boolean'];
};

export type PagedHackingPrograms = {
  __typename?: 'PagedHackingPrograms';
  content: Array<HackingProgram>;
  limit?: Maybe<Scalars['Int']>;
  count: Scalars['Int'];
  page: Scalars['Int'];
  last: Scalars['Boolean'];
};

export type PagedRules = {
  __typename?: 'PagedRules';
  content: Array<Rule>;
  limit?: Maybe<Scalars['Int']>;
  count: Scalars['Int'];
  page: Scalars['Int'];
  last: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['Int']>;
  allAmmo: PagedAmmo;
  allHackingDevices: PagedHackingDevices;
  allHackingPrograms: PagedHackingPrograms;
  allRules: PagedRules;
  ammoById?: Maybe<Ammo>;
  hackingDeviceById?: Maybe<HackingDevice>;
  hackingProgramById?: Maybe<HackingProgram>;
  ruleById?: Maybe<Rule>;
  searchAmmo: PagedAmmo;
  searchHackingDevices: PagedHackingDevices;
  searchHackingPrograms: PagedHackingPrograms;
  searchRules: PagedRules;
};


export type QueryAllAmmoArgs = {
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryAllHackingDevicesArgs = {
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryAllHackingProgramsArgs = {
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryAllRulesArgs = {
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryAmmoByIdArgs = {
  id: Scalars['ID'];
};


export type QueryHackingDeviceByIdArgs = {
  id: Scalars['ID'];
};


export type QueryHackingProgramByIdArgs = {
  id: Scalars['ID'];
};


export type QueryRuleByIdArgs = {
  id: Scalars['ID'];
};


export type QuerySearchAmmoArgs = {
  name: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySearchHackingDevicesArgs = {
  name: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySearchHackingProgramsArgs = {
  name: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QuerySearchRulesArgs = {
  name: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type Rule = {
  __typename?: 'Rule';
  id: Scalars['ID'];
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  type?: Maybe<RuleType>;
};

export type RuleRequest = {
  name: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  type?: Maybe<RuleType>;
};

export type RuleType =
  | 'TRANSMUTATION_AUTO'
  | 'TRANSMUTATION_WOUNDS'
  | 'MOTORCYCLE'
  | 'SUPPRESSIVE_FIRE'
  | 'DOCTOR'
  | 'ENGINEER'
  | 'FIRETEAM_CORE'
  | 'FIRETEAM_DUO'
  | 'HIDDEN_DEPLOYMENT';

export type ValidationError = {
  __typename?: 'ValidationError';
  title: Scalars['String'];
  description: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Ammo: ResolverTypeWrapper<AmmoEntity>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AmmoRequest: AmmoRequest;
  HackingDevice: ResolverTypeWrapper<HackingDevice>;
  HackingDeviceRequest: HackingDeviceRequest;
  HackingProgram: ResolverTypeWrapper<HackingProgram>;
  HackingProgramRequest: HackingProgramRequest;
  HackingProgramSkillType: HackingProgramSkillType;
  HackingProgramTarget: HackingProgramTarget;
  Mutation: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  PagedAmmo: ResolverTypeWrapper<Omit<PagedAmmo, 'content'> & { content: Array<ResolversTypes['Ammo']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PagedHackingDevices: ResolverTypeWrapper<PagedHackingDevices>;
  PagedHackingPrograms: ResolverTypeWrapper<PagedHackingPrograms>;
  PagedRules: ResolverTypeWrapper<Omit<PagedRules, 'content'> & { content: Array<ResolversTypes['Rule']> }>;
  Query: ResolverTypeWrapper<{}>;
  Rule: ResolverTypeWrapper<RuleEntity>;
  RuleRequest: RuleRequest;
  RuleType: RuleType;
  ValidationError: ResolverTypeWrapper<ValidationError>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Ammo: AmmoEntity;
  ID: Scalars['ID'];
  String: Scalars['String'];
  AmmoRequest: AmmoRequest;
  HackingDevice: HackingDevice;
  HackingDeviceRequest: HackingDeviceRequest;
  HackingProgram: HackingProgram;
  HackingProgramRequest: HackingProgramRequest;
  Mutation: {};
  Int: Scalars['Int'];
  PagedAmmo: Omit<PagedAmmo, 'content'> & { content: Array<ResolversParentTypes['Ammo']> };
  Boolean: Scalars['Boolean'];
  PagedHackingDevices: PagedHackingDevices;
  PagedHackingPrograms: PagedHackingPrograms;
  PagedRules: Omit<PagedRules, 'content'> & { content: Array<ResolversParentTypes['Rule']> };
  Query: {};
  Rule: RuleEntity;
  RuleRequest: RuleRequest;
  ValidationError: ValidationError;
}>;

export type AmmoResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Ammo'] = ResolversParentTypes['Ammo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  combinedAmmo?: Resolver<Array<ResolversTypes['Ammo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HackingDeviceResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['HackingDevice'] = ResolversParentTypes['HackingDevice']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  programs?: Resolver<Array<ResolversTypes['HackingProgram']>, ParentType, ContextType>;
  validationErrors?: Resolver<Maybe<Array<ResolversTypes['ValidationError']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HackingProgramResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['HackingProgram'] = ResolversParentTypes['HackingProgram']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  attackMod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  opponentMod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  damage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  burst?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  target?: Resolver<Array<ResolversTypes['HackingProgramTarget']>, ParentType, ContextType>;
  skillType?: Resolver<Array<ResolversTypes['HackingProgramSkillType']>, ParentType, ContextType>;
  special?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  addProgramToHackingDevice?: Resolver<ResolversTypes['HackingDevice'], ParentType, ContextType, RequireFields<MutationAddProgramToHackingDeviceArgs, 'hackingDeviceId' | 'hackingProgramId'>>;
  createAmmo?: Resolver<ResolversTypes['Ammo'], ParentType, ContextType, RequireFields<MutationCreateAmmoArgs, 'request'>>;
  createHackingDevice?: Resolver<ResolversTypes['HackingDevice'], ParentType, ContextType, RequireFields<MutationCreateHackingDeviceArgs, 'request'>>;
  createHackingProgram?: Resolver<ResolversTypes['HackingProgram'], ParentType, ContextType, RequireFields<MutationCreateHackingProgramArgs, 'request'>>;
  createRule?: Resolver<ResolversTypes['Rule'], ParentType, ContextType, RequireFields<MutationCreateRuleArgs, 'request'>>;
  removeProgramFromHackingDevice?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationRemoveProgramFromHackingDeviceArgs, 'hackingDeviceId' | 'hackingProgramId'>>;
  updateAmmo?: Resolver<ResolversTypes['Ammo'], ParentType, ContextType, RequireFields<MutationUpdateAmmoArgs, 'ammoId' | 'request'>>;
  updateHackingDevice?: Resolver<ResolversTypes['HackingDevice'], ParentType, ContextType, RequireFields<MutationUpdateHackingDeviceArgs, 'hackingDeviceId' | 'request'>>;
  updateHackingProgram?: Resolver<ResolversTypes['HackingProgram'], ParentType, ContextType, RequireFields<MutationUpdateHackingProgramArgs, 'hackingProgramId'>>;
  updateRule?: Resolver<ResolversTypes['Rule'], ParentType, ContextType, RequireFields<MutationUpdateRuleArgs, 'ruleId' | 'request'>>;
}>;

export type PagedAmmoResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['PagedAmmo'] = ResolversParentTypes['PagedAmmo']> = ResolversObject<{
  content?: Resolver<Array<ResolversTypes['Ammo']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PagedHackingDevicesResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['PagedHackingDevices'] = ResolversParentTypes['PagedHackingDevices']> = ResolversObject<{
  content?: Resolver<Array<ResolversTypes['HackingDevice']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PagedHackingProgramsResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['PagedHackingPrograms'] = ResolversParentTypes['PagedHackingPrograms']> = ResolversObject<{
  content?: Resolver<Array<ResolversTypes['HackingProgram']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PagedRulesResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['PagedRules'] = ResolversParentTypes['PagedRules']> = ResolversObject<{
  content?: Resolver<Array<ResolversTypes['Rule']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  allAmmo?: Resolver<ResolversTypes['PagedAmmo'], ParentType, ContextType, RequireFields<QueryAllAmmoArgs, never>>;
  allHackingDevices?: Resolver<ResolversTypes['PagedHackingDevices'], ParentType, ContextType, RequireFields<QueryAllHackingDevicesArgs, never>>;
  allHackingPrograms?: Resolver<ResolversTypes['PagedHackingPrograms'], ParentType, ContextType, RequireFields<QueryAllHackingProgramsArgs, never>>;
  allRules?: Resolver<ResolversTypes['PagedRules'], ParentType, ContextType, RequireFields<QueryAllRulesArgs, never>>;
  ammoById?: Resolver<Maybe<ResolversTypes['Ammo']>, ParentType, ContextType, RequireFields<QueryAmmoByIdArgs, 'id'>>;
  hackingDeviceById?: Resolver<Maybe<ResolversTypes['HackingDevice']>, ParentType, ContextType, RequireFields<QueryHackingDeviceByIdArgs, 'id'>>;
  hackingProgramById?: Resolver<Maybe<ResolversTypes['HackingProgram']>, ParentType, ContextType, RequireFields<QueryHackingProgramByIdArgs, 'id'>>;
  ruleById?: Resolver<Maybe<ResolversTypes['Rule']>, ParentType, ContextType, RequireFields<QueryRuleByIdArgs, 'id'>>;
  searchAmmo?: Resolver<ResolversTypes['PagedAmmo'], ParentType, ContextType, RequireFields<QuerySearchAmmoArgs, 'name'>>;
  searchHackingDevices?: Resolver<ResolversTypes['PagedHackingDevices'], ParentType, ContextType, RequireFields<QuerySearchHackingDevicesArgs, 'name'>>;
  searchHackingPrograms?: Resolver<ResolversTypes['PagedHackingPrograms'], ParentType, ContextType, RequireFields<QuerySearchHackingProgramsArgs, 'name'>>;
  searchRules?: Resolver<ResolversTypes['PagedRules'], ParentType, ContextType, RequireFields<QuerySearchRulesArgs, 'name'>>;
}>;

export type RuleResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Rule'] = ResolversParentTypes['Rule']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['RuleType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ValidationErrorResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['ValidationError'] = ResolversParentTypes['ValidationError']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = AppContext> = ResolversObject<{
  Ammo?: AmmoResolvers<ContextType>;
  HackingDevice?: HackingDeviceResolvers<ContextType>;
  HackingProgram?: HackingProgramResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PagedAmmo?: PagedAmmoResolvers<ContextType>;
  PagedHackingDevices?: PagedHackingDevicesResolvers<ContextType>;
  PagedHackingPrograms?: PagedHackingProgramsResolvers<ContextType>;
  PagedRules?: PagedRulesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rule?: RuleResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = AppContext> = Resolvers<ContextType>;
