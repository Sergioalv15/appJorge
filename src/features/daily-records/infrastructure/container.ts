import { DailyRecordService } from '../application/DailyRecordService';
import { SQLiteDailyRecordRepository } from './SQLiteDailyRecordRepository';

const repository = new SQLiteDailyRecordRepository();

export const dailyRecordService = new DailyRecordService(repository);
