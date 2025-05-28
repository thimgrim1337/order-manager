import { addYears, endOfYear, format, isPast, startOfYear } from 'date-fns';
import { pl } from 'date-fns/locale';
import { RequestHandler } from 'express';
import { AppError } from '@/lib/app-error';
import path from 'path';
import { checkIfDirExist, readData, writeData } from '@/lib/file';

const formatDate = (date: Date | number, dateFormat: string = 'yyyy-MM-dd') =>
  format(date, dateFormat, { locale: pl });

export const getAllHolidays: RequestHandler<{}> = async (req, res, next) => {
  try {
    const dirPath = path.join(process.cwd(), 'data');
    const filePath = path.join(dirPath, 'holidays.json');

    let validFrom = formatDate(startOfYear(Date.now()));
    let validTo = formatDate(addYears(endOfYear(validFrom), 2));
    let refetch = false;

    await checkIfDirExist(dirPath);

    if (isPast(validTo)) {
      validFrom = formatDate(addYears(validFrom, 2));
      validTo = formatDate(addYears(validTo, 2));
      refetch = true;
    }

    const existingData = await readData(filePath);

    if (existingData) res.status(200).json(JSON.parse(existingData));

    if (!existingData || refetch) {
      const response = await fetch(
        `https://openholidaysapi.org/PublicHolidays?countryIsoCode=PL&validFrom=${validFrom}&validTo=${validTo}&languageIsoCode=PL`
      );

      if (!response.ok)
        throw new AppError(
          'Failed to fetch holidays. Please try again later.',
          500
        );

      const data = await response.json();

      await writeData(filePath, data);

      res.status(200).json(data);
    }
  } catch (error) {
    next(error);
  }
};
