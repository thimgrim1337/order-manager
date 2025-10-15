import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/primitives/table';
import { Day } from '@/helpers/dates';
import { cn } from '@/lib/utils';
import { CountryWithId, OrderWithDetails, City } from '@/types/types';
import { MoveRight } from 'lucide-react';
import { useShuffledColors } from '../hooks/useShuffledColors';
import { ReactNode } from 'react';
import StatusBadge from '@/components/status-badge';
import { isAfter, isBefore, isWeekend } from 'date-fns';
import { Badge } from '@/components/ui/primitives/badge';

const columns = ['Pojazd', 'Status', 'Trasa'];

const borderColors = [
  'border-chart-1',
  'border-chart-2',
  'border-chart-3',
  'border-chart-4',
  'border-chart-5',
];

type TimeTableProps = {
  orders: OrderWithDetails[];
  countries: CountryWithId[];
  daysOfWeek: Day[];
};

export default function TimeTable({
  orders,
  countries,
  daysOfWeek,
}: TimeTableProps) {
  const shuffledColors = useShuffledColors(borderColors);

  const ordersColorMap = orders.reduce(
    (acc, order, i) => {
      const color = shuffledColors[i % shuffledColors.length];
      acc[order.orderNr] = color;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <Table className='my-5'>
      <TableHeader>
        <TableRow className='uppercase'>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
          {daysOfWeek.map((day) => (
            <TableHead
              key={day.shortDate}
              className={`${isWeekend(day.longDate) && 'text-primary'} min-w-[150px] text-center`}
            >
              {day.name} {day.shortDate}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <OrderInfo
            key={order.orderNr}
            order={order}
            countries={countries}
            daysOfWeek={daysOfWeek}
            borderColor={ordersColorMap[order.orderNr]}
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
  borderColor: string;
};

function OrderInfo({
  order,
  countries,
  daysOfWeek,
  borderColor,
}: OrderInfoProps) {
  return (
    <TableRow className='h-10'>
      <TruckInfo order={order} />
      <StatusInfo order={order} />
      <RouteInfo order={order} countries={countries} />
      {daysOfWeek.map((day) => (
        <OperationBar
          key={`${order.orderNr} - ${day.longDate}`}
          day={day}
          order={order}
          borderColor={borderColor}
        />
      ))}
    </TableRow>
  );
}

type TruckInfoProps = {
  order: OrderWithDetails;
};

function TruckInfo({ order }: TruckInfoProps) {
  return (
    <TableCell>
      <div className='flex flex-col gap-2'>
        <span>{order.driver}</span>
        <span className='text-muted-foreground text-xs'>{order.truck}</span>
      </div>
    </TableCell>
  );
}

type RouteProps = {
  place: City;
  countries: CountryWithId[];
  className?: string;
  icon?: ReactNode;
};

function Route({ place, countries, className, icon }: RouteProps) {
  const countryMap = Object.fromEntries(countries.map((c) => [c.id, c]));

  return (
    <div className={cn(['flex gap-1 items-center', className])}>
      {icon && icon}
      <span>{countryMap[place?.countryID]?.code}</span>
      <span>{place?.postal}</span>
      <span>{place?.name}</span>
    </div>
  );
}

type RouteInfoProps = {
  order: OrderWithDetails;
  countries: CountryWithId[];
};

function RouteInfo({ order, countries }: RouteInfoProps) {
  const firstLoadingPlace = order.loadingPlaces[0];
  const lastUnloadingPlace =
    order.unloadingPlaces[order.unloadingPlaces.length - 1];

  return (
    <TableCell>
      <div className='flex flex-col gap-2 pr-4'>
        <Route countries={countries} place={firstLoadingPlace} />
        <Route
          countries={countries}
          place={lastUnloadingPlace}
          className='text-xs text-muted-foreground '
          icon={<MoveRight size={'1rem'} />}
        />
      </div>
    </TableCell>
  );
}

function StatusInfo({ order }: { order: OrderWithDetails }) {
  return (
    <TableCell>
      <div className='flex flex-col gap-2'>
        <span>{order.customer.split(' ')[0]}</span>
        <StatusBadge statusID={order.statusID} className='self-start'>
          {order.status}
        </StatusBadge>
      </div>
    </TableCell>
  );
}

function OperationBar({
  order,
  day,
  borderColor,
}: {
  order: OrderWithDetails;
  day: Day;
  borderColor: string;
}) {
  const isOrderProcessed =
    order.startDate === day.longDate ||
    order.endDate === day.longDate ||
    (isAfter(day.longDate, order.startDate) &&
      isBefore(day.longDate, order.endDate));

  const isLoading = order.startDate === day.longDate;
  const isUnloading = order.endDate === day.longDate;

  return isOrderProcessed ? (
    <TableCell className={`border-b-[1rem] ${borderColor}`}>
      <span className='flex justify-center'>
        {isLoading && <Badge variant={'outline'}>Załadunek</Badge>}
        {isUnloading && <Badge variant={'outline'}>Rozładunek</Badge>}
      </span>
    </TableCell>
  ) : (
    <TableCell key={day.longDate}></TableCell>
  );
}
