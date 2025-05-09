import { AppError } from '@/lib/app-error';
import { Address } from './addresses.model';
import { addressServices } from './addresses.services';

export async function getAllAddresses() {
  return await addressServices.getAddressesQuery();
}

export async function getAddressById(addressID: number) {
  return await addressServices.getAddressByIdQuery(addressID);
}

export async function checkIfAddressExist(address: Address) {
  return await addressServices.getAddressByStreetQuery(address);
}

export async function addAddress(address: Address) {
  try {
    const isExist = await checkIfAddressExist(address);

    if (isExist) return isExist.id;

    const newAddress = await addressServices.createAddressQuery(address);

    return newAddress[0]?.id;
  } catch (error) {
    console.error(error);
    throw new AppError('An error occured when adding address.', 500);
  }
}

export async function updateAddress(addressID: number, address: Address) {
  try {
    const updatedAddress = await addressServices.updateAddressQuery(
      addressID,
      address
    );

    return updatedAddress[0]?.id;
  } catch (error) {
    throw new AppError('An error occured when update address.', 500);
  }
}

export async function deleteAddress(addressID: number) {
  try {
    await addressServices.deleteAddressQuery(addressID);
  } catch (error) {
    throw new AppError('An error occured when delete address.', 500);
  }
}
