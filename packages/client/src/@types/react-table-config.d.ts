import {
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersOptions,
  UseFiltersState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table';

declare module 'react-table' {
  export interface TableOptions<D extends Record<string, unknown>>
    extends UseFiltersOptions<D>,
      UseRowSelectOptions<D>,
      UseSortByOptions<D> {}

  export interface Hooks<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseFiltersOptions,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseFiltersInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseFiltersState<D>,
      UseRowSelectState<D>,
      UseSortByState<D> {}

  export interface ColumnInterface<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseFiltersColumnOptions<D>,
      UseSortByColumnOptions<D> {}

  export interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseFiltersColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<D extends Record<string, unknown> = Record<string, unknown>, V = any>
    extends UseGroupByCellProps<D>,
      UseRowStateCellProps<D> {}

  export type Row<D extends Record<string, unknown> = Record<string, unknown>> =
    UseRowSelectRowProps<D>;
}
