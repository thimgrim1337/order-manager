import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/primitives/table';
import { Day } from '@/helpers/dates';
import { cn } from '@/lib/utils';
import { CountryWithId, OrderWithDetails, City } from '@/types/types';
import { ReactNode } from '@tanstack/react-router';
import { ArrowLeftFromLine, ArrowRightToLine } from 'lucide-react';
import { useShuffledColors } from '../hooks/useShuffledColors';

const bgColors = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
];

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
  const shuffledColors = useShuffledColors(bgColors);

  const tableTitle = (
    <div className='flex flex-col'>
      <span>{weekNumber} tydzień</span>
      <span>
        {`${daysOfWeek[0].date} - ${daysOfWeek[daysOfWeek.length - 1].date}`}
      </span>
    </div>
  );

  const sortedOrders = [...orders].sort(
    (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
  );

  const ordersColorMap = sortedOrders.reduce(
    (acc, order, i) => {
      const color = shuffledColors[i % shuffledColors.length];
      acc[order.orderNr] = color;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <Table>
      <TableCaption>{tableTitle}</TableCaption>
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
        {sortedOrders.map((order) => (
          <OrderInfo
            key={order.orderNr}
            order={order}
            countries={countries}
            daysOfWeek={daysOfWeek}
            bgColor={ordersColorMap[order.orderNr]}
          />
        ))}
      </TableBody>
    </Table>
  );
}

type OrderInfoProps = {
  order: OrderWithDetails;
  countries: CountryWithId[];
  daysOfWeek: Day[];
  bgColor: string;
};

function OrderInfo({ order, countries, daysOfWeek, bgColor }: OrderInfoProps) {
  return (
    <TableRow className='h-10'>
      {daysOfWeek.map((day) => {
        return order.startDate === day.date || order.endDate === day.date ? (
          <TableCell
            key={`${order.orderNr} - ${day.date}`}
            className={
              bgColor === 'bg-chart-3'
                ? `${bgColor} text-primary-foreground`
                : bgColor
            }
          >
            {order.startDate === day.date && (
              <PlaceInfo
                countries={countries}
                place={order.loadingPlaces[0]}
                icon={<ArrowRightToLine />}
              />
            )}
            {order.endDate === day.date && (
              <PlaceInfo
                countries={countries}
                place={order.unloadingPlaces[0]}
                className='justify-end'
                icon={<ArrowLeftFromLine />}
              />
            )}
          </TableCell>
        ) : (
          <TableCell key={day.date}></TableCell>
        );
      })}
    </TableRow>
  );
}

type PlaceInfoProps = {
  place: City;
  countries: CountryWithId[];
  className?: string;
  icon?: ReactNode;
};

function PlaceInfo({ place, countries, className, icon }: PlaceInfoProps) {
  const countryMap = Object.fromEntries(countries.map((c) => [c.id, c]));

  return (
    <div className={cn(['flex gap-1 items-center font-semibold', className])}>
      {icon}
      <span>{countryMap[place?.countryID]?.code}</span>
      <span>{place?.postal}</span>
      <span>{place?.name}</span>
    </div>
  );
}
