// src/pages/ProductUploadPage.jsx

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';

export default function ProductUploadPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Placeholder submission
    console.log('Form data:', data);
    toast.success('Product data captured! (UI only)');
  };

  return (
    <div className="max-w-4xl mx-auto my-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Upload New Product</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="SuperWidget 3000"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="apparel">Apparel</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>
            </div>

            {/* SEO Title */}
            <div>
              <Label htmlFor="title">Page Title (SEO)</Label>
              <Input
                id="title"
                placeholder="Buy SuperWidget 3000 Online"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Short Description */}
            <div>
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Quick product overview..."
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            {/* Full Details & Features */}
            <div>
              <Label htmlFor="details">Full Details</Label>
              <Textarea
                id="details"
                rows={4}
                placeholder="All the nitty-gritty..."
                {...register('details', { required: 'Details are required' })}
              />
              {errors.details && <p className="text-xs text-red-500 mt-1">{errors.details.message}</p>}
            </div>
            <div>
              <Label htmlFor="features">Key Features (comma-separated)</Label>
              <Input
                id="features"
                placeholder="fast, durable, eco-friendly"
                {...register('features', { required: 'Features are required' })}
              />
              {errors.features && <p className="text-xs text-red-500 mt-1">{errors.features.message}</p>}
            </div>

            {/* Preview & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="livePreview">Live Preview URL</Label>
                <Input
                  id="livePreview"
                  placeholder="https://example.com/preview"
                  {...register('livePreview', {
                    pattern: { value: /^https?:\/\//, message: 'Must be a valid URL' },
                  })}
                />
                {errors.livePreview && <p className="text-xs text-red-500 mt-1">{errors.livePreview.message}</p>}
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="widget,gadget,tool"
                  {...register('tags', { required: 'At least one tag is required' })}
                />
                {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
              </div>
            </div>

            {/* Images */}
            <div>
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                {...register('images', { required: 'Please select at least one image' })}
              />
              {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Preview & Next'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
