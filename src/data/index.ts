import { DataProvider } from './providers/DataProvider';
import { FootballApiProvider } from './providers/FootballApiProvider';
import { SampleDataProvider } from './providers/SampleDataProvider';

const dataSource = import.meta.env.VITE_DATA_SOURCE;

export const dataProvider: DataProvider =
  dataSource === 'api' ? new FootballApiProvider() : new SampleDataProvider();

export * from './providers/DataProvider';
