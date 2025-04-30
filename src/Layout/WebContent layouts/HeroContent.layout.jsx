import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

/**
 * HeroContentForm
 * Demo form for editing Home hero section with mock data.
 */
export default function HeroContentForm() {
  const [previewImage, setPreviewImage] = useState('https://res.cloudinary.com/shotlin/image/upload/c_fill,dpr_auto,f_avif,q_auto:eco,w_800/v1/images/1738085622377?_a=BAMCkGa40');
  const form = useForm({
    defaultValues: {
      heroTitle: 'Welcome to Shortlin',
      heroDescription: 'Your one-stop SaaS solution for B2B, B2C, and B2G needs.',
      heroVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      heroImage: 'https://res.cloudinary.com/shotlin/image/upload/c_fill,dpr_auto,f_avif,q_auto:eco,w_800/v1/images/1738085622377?_a=BAMCkGa40',
    },
  });
  const { handleSubmit, control, reset } = form;

  const onSubmit = (values) => {
    // Demo submit - just show toast and reset preview to demo
    console.log('Demo values:', values);
    toast.success('Demo: Hero content updated successfully');
    reset(values);
    if (values.heroImage?.[0]) {
      setPreviewImage(URL.createObjectURL(values.heroImage[0]));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Edit Hero Section (Demo)</h3>
      <Form {...form} onSubmit={handleSubmit(onSubmit)}>
        <form className="space-y-6">
          <FormField
            control={control}
            name="heroTitle"
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter hero title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="heroDescription"
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter a brief description" rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="heroVideoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="YouTube or MP4 URL" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="heroImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero Image</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      if (e.target.files?.[0]) {
                        setPreviewImage(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="block w-full text-sm text-gray-600"
                  />
                </FormControl>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Hero Preview"
                    className="mt-3 w-full h-auto rounded"
                  />
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Changes (Demo)
          </Button>
        </form>
      </Form>
    </div>
  );
}
