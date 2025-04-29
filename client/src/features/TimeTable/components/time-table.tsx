import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Day } from '@/helpers/dates';
import { CountryWithId, OrderWithDetails } from '@/types/types';

type TimeTableProps = {
  orders: OrderWithDetails[];
  countries: CountryWithId[];
  daysOfWeek: Day[];
  weekNumber: string;
};

export default function TimeTable({
  orders,
  countries,
  daysOfWeek,
  weekNumber,
}: TimeTableProps) {
  return (
    <>
      <Table>
        <TableCaption>{weekNumber} tydzień.</TableCaption>
        <TableHeader>
          <TableRow>
            {daysOfWeek.map((day) => (
              <TableHead key={day.date}>
                {day.name} {day.date}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow className='h-10' key={order.id}>
              {daysOfWeek.map((day) => {
                return order.startDate === day.date ||
                  order.endDate === day.date ? (
                  <TableCell
                    key={day.date}
                    className={
                      order.startDate === day.date || order.endDate === day.date
                        ? 'bg-primary text-primary-foreground'
                        : undefined
                    }
                  >
                    {order.startDate === day.date && (
                      <div className='flex gap-1'>
                        <span>
                          {
                            countries[order.loadingPlaces[0]?.countryID - 1]
                              .code
                          }
                        </span>
                        <span>{order.loadingPlaces[0]?.postal}</span>
                        <span>{order.loadingPlaces[0]?.name}</span>
                      </div>
                    )}

                    {order.endDate === day.date && (
                      <div className='flex gap-2'>
                        <span>
                          {
                            countries[order.unloadingPlaces[0]?.countryID - 1]
                              .code
                          }
                        </span>
                        <span>{order.unloadingPlaces[0]?.postal}</span>
                        <span>{order.unloadingPlaces[0]?.name}</span>
                      </div>
                    )}
                  </TableCell>
                ) : (
                  <TableCell key={day.date}></TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
