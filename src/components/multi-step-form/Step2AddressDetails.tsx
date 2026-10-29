import React from 'react';
import { useForm } from 'react-hook-form';
import { useMultiStepFormStore } from '../../store/useMultiStepFormStore';
import { AddressDetails } from '../../types/multiStepForm';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MapPin, Building, Globe, Hash, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'India',
  'Singapore',
  'Japan',
  'Brazil',
  'Other',
];

export const Step2AddressDetails: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useMultiStepFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressDetails>({
    mode: 'onBlur',
    defaultValues: {
      streetAddress: formData.streetAddress,
      city: formData.city,
      zipCode: formData.zipCode,
      country: formData.country || 'United States',
    },
  });

  const onSubmit = (data: AddressDetails) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 text-left">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Step 2: Address Details
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Enter your residential or billing location details.
        </p>
      </div>

      {/* Street Address */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="streetAddress" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Street Address <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            id="streetAddress"
            placeholder="e.g. 742 Evergreen Terrace"
            className="pl-9 h-10 text-xs"
            {...register('streetAddress', {
              required: 'Street address is required',
              minLength: {
                value: 5,
                message: 'Please provide a valid street address',
              },
            })}
          />
        </div>
        {errors.streetAddress && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.streetAddress.message}</span>
          </p>
        )}
      </div>

      {/* City & Zip Code Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="city" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            City <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <Input
              id="city"
              placeholder="e.g. Springfield"
              className="pl-9 h-10 text-xs"
              {...register('city', {
                required: 'City is required',
                minLength: {
                  value: 2,
                  message: 'City must be at least 2 characters',
                },
              })}
            />
          </div>
          {errors.city && (
            <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.city.message}</span>
            </p>
          )}
        </div>

        {/* Zip Code (Numeric Required) */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="zipCode" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Zip / Postal Code <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <Input
              id="zipCode"
              placeholder="e.g. 97477"
              className="pl-9 h-10 text-xs"
              {...register('zipCode', {
                required: 'Postal / Zip code is required',
                pattern: {
                  value: /^[0-9A-Za-z\s-]{3,10}$/,
                  message: 'Please enter a valid numeric/alphanumeric postal code',
                },
              })}
            />
          </div>
          {errors.zipCode && (
            <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.zipCode.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Country Dropdown */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="country" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Country <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <select
            id="country"
            className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-9 pr-3 text-xs text-zinc-900 dark:text-zinc-100 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-300"
            {...register('country', { required: 'Country is required' })}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {errors.country && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.country.message}</span>
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={prevStep}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Personal</span>
        </Button>

        <Button type="submit" size="lg" className="gap-2 text-xs font-semibold">
          <span>Continue to Account</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
