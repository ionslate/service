import {
  ConnectionException,
  ConstraintViolationException,
  DatabaseObjectExistsException,
  DatabaseObjectNotFoundException,
  DriverException,
  ForeignKeyConstraintViolationException,
  InvalidFieldNameException,
  LockWaitTimeoutException,
  MetadataError,
  NonUniqueFieldNameException,
  NotNullConstraintViolationException,
  ReadOnlyException,
  TableExistsException,
  TableNotFoundException,
  UniqueConstraintViolationException,
  ValidationError,
} from '@mikro-orm/core';

export const DB_ERRORS = [
  ConnectionException.name,
  ConstraintViolationException.name,
  DatabaseObjectExistsException.name,
  DatabaseObjectNotFoundException.name,
  DriverException.name,
  ForeignKeyConstraintViolationException.name,
  InvalidFieldNameException.name,
  LockWaitTimeoutException.name,
  MetadataError.name,
  NonUniqueFieldNameException.name,
  NotNullConstraintViolationException.name,
  ReadOnlyException.name,
  TableExistsException.name,
  TableNotFoundException.name,
  UniqueConstraintViolationException.name,
  ValidationError.name,
];