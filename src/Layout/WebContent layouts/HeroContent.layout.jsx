// src/Layout/WebContent layouts/HeroContent.layout.jsx

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWebContent, useUpdateHeroContent } from '@/Hooks/useWebContent';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'react-hot-toast';

export default function HeroContentForm() {
  const { data, isLoading, isError, refetch } = useWebContent();
  const updateMutation = useUpdateHeroContent();

  const [previewImage, setPreviewImage] = useState('');

  const form = useForm({
    defaultValues: {
      heroTitle: '',
      heroDescription: '',
      heroVideoUrl: '',
      heroImage: null,
    },
  });

  const { handleSubmit, control, reset, setValue, watch } = form;

  useEffect(() => {
    if (data?.hero) {
      const { heroTitle, heroDescription, heroVideoUrl, heroImage } = data.hero;
      reset({ heroTitle, heroDescription, heroVideoUrl, heroImage: null });
      setPreviewImage(heroImage);
    }
  }, [data, reset]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('heroTitle', values.heroTitle);
    formData.append('heroDescription', values.heroDescription);
    formData.append('heroVideoUrl', values.heroVideoUrl);

    if (values.heroImage?.[0]) {
      formData.append('heroImage', values.heroImage[0]);
    }

    try {
      await updateMutation.mutateAsync(formData);
      await refetch();
      toast.success('You changed successfully', { position: 'top-right' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(`Update failed: ${msg}`, { position: 'top-right' });
    }
  };

  if (isLoading) {
    return <p className="p-6 text-center">Loading hero content…</p>;
  }

  if (isError) {
    return <p className="p-6 text-center text-red-600">Error loading hero content.</p>;
  }

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Edit Hero Section</h3>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hero Title */}
          <FormField
            control={control}
            name="heroTitle"
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter hero title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hero Description */}
          <FormField
            control={control}
            name="heroDescription"
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} placeholder="Enter a brief description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Video URL */}
          <FormField
            control={control}
            name="heroVideoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL (YouTube link)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://youtu.be/..." />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Hero Image Upload */}
          <FormField
            control={control}
            name="heroImage"
            render={() => (
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        setValue('heroImage', files); // ✅ critical for RHF
                        setPreviewImage(URL.createObjectURL(files[0]));
                      }
                    }}
                    className="block w-full text-sm text-gray-600"
                  />
                </FormControl>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Hero Preview"
                    className="mt-3 w-full h-auto rounded border"
                  />
                )}
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
