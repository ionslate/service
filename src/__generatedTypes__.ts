import { AppContext } from './utils';
import { GraphQLResolveInfo } from 'graphql';
import { RuleEntity } from './content/common/entities/RuleEntity';
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

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['Int']>;
  createRule: Rule;
  updateRule: Rule;
};


export type MutationCreateRuleArgs = {
  request: RuleRequest;
};


export type MutationUpdateRuleArgs = {
  ruleId: Scalars['ID'];
  request: RuleRequest;
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
  allRules: PagedRules;
  ruleById?: Maybe<Rule>;
  searchRules: PagedRules;
};


export type QueryAllRulesArgs = {
  page?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueryRuleByIdArgs = {
  id: Scalars['ID'];
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
  Mutation: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  PagedRules: ResolverTypeWrapper<Omit<PagedRules, 'content'> & { content: Array<ResolversTypes['Rule']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Rule: ResolverTypeWrapper<RuleEntity>;
  RuleRequest: RuleRequest;
  RuleType: RuleType;
  ValidationError: ResolverTypeWrapper<ValidationError>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Mutation: {};
  Int: Scalars['Int'];
  ID: Scalars['ID'];
  PagedRules: Omit<PagedRules, 'content'> & { content: Array<ResolversParentTypes['Rule']> };
  Boolean: Scalars['Boolean'];
  Query: {};
  String: Scalars['String'];
  Rule: RuleEntity;
  RuleRequest: RuleRequest;
  ValidationError: ValidationError;
}>;

export type MutationResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createRule?: Resolver<ResolversTypes['Rule'], ParentType, ContextType, RequireFields<MutationCreateRuleArgs, 'request'>>;
  updateRule?: Resolver<ResolversTypes['Rule'], ParentType, ContextType, RequireFields<MutationUpdateRuleArgs, 'ruleId' | 'request'>>;
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
  allRules?: Resolver<ResolversTypes['PagedRules'], ParentType, ContextType, RequireFields<QueryAllRulesArgs, never>>;
  ruleById?: Resolver<Maybe<ResolversTypes['Rule']>, ParentType, ContextType, RequireFields<QueryRuleByIdArgs, 'id'>>;
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
  Mutation?: MutationResolvers<ContextType>;
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
