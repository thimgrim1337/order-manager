import { Button } from '@/components/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
import FormCountrySelect from '@/components/ui/form/form-country-select';
import { Input } from '@/components/ui/primitives/input';
import { City } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  FieldName,
  FieldValues,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';

const initialValues: City = {
  countryID: 39,
  postal: '',
  name: '',
};

type PlaceFormProps<TFieldValues extends FieldValues> = {
  name: FieldName<TFieldValues>;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

export default function PlaceForm({
  name,
  onOpenChange,
}: PlaceFormProps<FieldValues>) {
  const { showBoundary } = useErrorBoundary();
  const { control } = useFormContext();
  const { append } = useFieldArray({
    control,
    name,
  });

  const form = useForm<City>({
    resolver: zodResolver(City),
    defaultValues: initialValues,
  });

  async function onSubmit(formData: City) {
    try {
      append(formData);
      onOpenChange(false);
    } catch (error) {
      showBoundary({
        message: 'An error occured. Please again later.',
        stack: `Stack ${error}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form className='flex flex-col gap-2'>
        <FormField
          control={form.control}
          name='countryID'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kraj</FormLabel>
              <FormControl>
                <FormCountrySelect {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='postal'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kod pocztowy</FormLabel>
              <FormControl>
                <Input placeholder='09-400' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='col-start-3 -col-end-1'>
              <FormLabel>Miejscowość</FormLabel>
              <FormControl>
                <Input placeholder='Płock' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='button'
          onClick={form.handleSubmit(onSubmit, (error) => console.log(error))}
        >
          Zapisz
        </Button>
      </form>
    </Form>
  );
}
