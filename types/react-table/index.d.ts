/* eslint-disable @typescript-eslint/no-explicit-any */

// to extend types by added table plugin
// @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-table/Readme.md
import {
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table'

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<
    D extends Record<string, unknown>,
  > extends UsePaginationOptions<D>,
      UseSortByOptions<D>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  export interface TableInstance<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UsePaginationState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseSortByColumnOptions<D>,
      Record<string, any> {}

  export interface ColumnInstance<
    D extends Record<string, unknown> = Record<string, unknown>,
  > extends UseSortByColumnProps<D>,
      Record<string, any> {}
}
